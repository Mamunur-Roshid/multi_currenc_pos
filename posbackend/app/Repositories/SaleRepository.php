<?php
namespace App\Repositories;

use App\Models\CompanyProfile;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\SaleReturn;
use App\Models\CurrentInventory;
use App\Models\Customer;
use stdClass;
use Exception;
use Illuminate\Support\Facades\DB;

class SaleRepository 
{
    public function Get($arg = [])
    {
        // $sales = Sale::with(['customer', 'employee', 'added_by', 'sale_details.product'])->where('branch_id', app('branchId'));
        $sales = Sale::with(['customer', 'employee', 'added_by', 'sale_details.product' => function($q) {
            return $q->with(['unit']);
        }])->where('branch_id', app('branchId'));

        if(isset($arg['id']) && $arg['id'] != '') {
            $sales = $sales->where('id', $arg['id']);
        }

        if(isset($arg['dateFrom']) && $arg['dateFrom'] != '' && isset($arg['dateTo']) && $arg['dateTo'] != '') {
            $sales = $sales->whereBetween('date', [$arg['dateFrom'], $arg['dateTo']]);
        }

        if(isset($arg['customerId']) && $arg['customerId'] != '') {
            $sales = $sales->where('customer_id', $arg['customerId']);
        }

        if(isset($arg['employeeId']) && $arg['employeeId'] != '') {
            $sales = $sales->where('employee_id', $arg['employeeId']);
        }

        if(isset($arg['productId']) && $arg['productId'] != '') {
            $sales = $sales->whereHas('sale_details', function($query) use($arg) {
                return $query->where('product_id', $arg['productId']);
            });
        }

        return $sales->latest()->get();
    }

    public function GetInvoice()
    {
       return Sale::select('id', 'invoice')->where('status', 'a')->where('branch_id', app('branchId'))->latest()->get();
    }

    public function GetById($id)
    {
        return Sale::where('id', $id)->where('branch_id', app('branchId'))->first();
    }

    public function GenerateCustomerCode()
    {
        $customer = Customer::withTrashed()->orderBy('id', 'desc');
        $customerId = ($customer->count() == 0 ? 0 : $customer->first()->id) + 1;
        $zeros = 5 - strlen($customerId);
        $newCustomerCode = "C";
        for($i = 1; $i <= $zeros; $i++) $newCustomerCode .= '0';
        $newCustomerCode .= $customerId;
        return $newCustomerCode;
    }

    public function Insert(Sale $sale, $saleDetails, $customer)
    {
        $res = new stdClass();
        DB::beginTransaction();

        try {
            $branchId = app('branchId');
            
            $validation = $this->ValidateSale($sale);
            if(strlen($validation) != 0) {
                $res->code = 406;
                $res->message = $validation;
                return $res;
            }

            $duplicateInvoice = Sale::where('invoice', $sale->invoice)->first();
            if($duplicateInvoice) {
                $sale->invoice = $this->GenerateSaleInvoice();
            }

            $customerId = $sale->customer_id;
            // customer
            if(isset($customer)) {
                $cust = new Customer();
                $cust->code = $this->GenerateCustomerCode();
                $cust->name = $customer['name'];
                $cust->phone = $customer['phone'];
                $cust->address = $customer['address'];
                $cust->type = $customer['type'];

                $cust->save();
                $customerId = $cust->id;
            }

            $comp_profile = CompanyProfile::first();

            $sale->customer_id = $customerId;
            $sale->branch_id = $branchId;
            $sale->added_by = app('userId');
            $sale->currency_rate = $comp_profile->dolor_rate ? $comp_profile->dolor_rate : 1;
            $sale->save();

            // sale detail
            $saleDetails = array_map(function($product) use($branchId) {
                return [
                    'product_id' => $product['id'],
                    'purchase_rate' => $product['purchase_rate'],
                    'sale_rate' => $product['sale_rate'],
                    'quantity' => $product['quantity'],
                    'total' => $product['total'],
                    'branch_id' => $branchId
                ];
            }, $saleDetails);

            $sale->sale_details()->createMany($saleDetails);

            // current inventory update
            foreach($saleDetails as $product) {
                    $stock = CurrentInventory::where('product_id', $product['product_id'])->first();
                    $stock->sale_quantity = $stock->sale_quantity + $product['quantity'];
                    $stock->current_stock = $stock->current_stock - $product['quantity'];
                    $stock->save();
            }

            $res->code = 200;
            $res->id = $sale->id;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            DB::rollBack();
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        DB::commit();
        return $res;
    }

    public function Update(Sale $sale, $saleDetails)
    {
        $res = new stdClass();
        DB::beginTransaction();

        try {
            $branchId = app('branchId');
            
            $validation = $this->ValidateSale($sale);
            if(strlen($validation) != 0) {
                $res->code = 406;
                $res->message = $validation;
                return $res;
            }

            $duplicateInvoice = Sale::where('invoice', $sale->invoice)->where('id', '!=', $sale->id)->where('branch_id', $branchId)->first();
            if($duplicateInvoice) {
                $sale->invoice = $this->GenerateSaleInvoice();
            }

            $sale->branch_id = $branchId;
            $sale->updated_by = app('userId');
            $sale->save();

            // purchase details
            $oldDetails = SaleDetail::where('sale_id', $sale->id)->where('branch_id', $branchId)->get(); 
            
            // remove current inventory
            foreach($oldDetails as $product) {
                $stock = CurrentInventory::where('product_id', $product->product_id)->where('branch_id', $branchId)->first();
                $stock->sale_quantity = $stock->sale_quantity - $product->quantity;
                $stock->save();
            }

            // delete old detail
            SaleDetail::where('sale_id', $sale->id)->where('branch_id', app('branchId'))->forceDelete();

            // purchase detail
            $saleDetails = array_map(function($product) use($branchId) {
                return [
                    'product_id' => $product['id'],
                    'purchase_rate' => $product['purchase_rate'],
                    'sale_rate' => $product['sale_rate'],
                    'quantity' => $product['quantity'],
                    'total' => $product['total'],
                    'branch_id' => $branchId
                ];
            }, $saleDetails);

            $sale->sale_details()->createMany($saleDetails);

            // current inventory update
            foreach($saleDetails as $product) {
                $countProduct = CurrentInventory::where('product_id', $product['product_id'])->where('branch_id', $branchId)->count();
                
                if($countProduct > 0) {
                    $stock = CurrentInventory::where('product_id', $product['product_id'])->where('branch_id', $branchId)->first();
                    $stock->sale_quantity = $stock->sale_quantity + $product['quantity'];
                    $stock->save();
                    
                } else {
                    $stock = new CurrentInventory();
                    $stock->product_id = $product['product_id'];
                    $stock->sale_quantity = $stock->sale_quantity + $product['quantity'];
                    $stock->branch_id = $branchId;
                    $stock->save();
                }
            }

            $res->code = 200;
            $res->id = $sale->id;
            $res->message = "Update successfully";
        } catch(Exception $ex) {
            DB::rollBack();
            $res->code = 500;
            $res->message = $ex->getMessage();
        }

        DB::commit();
        return $res;
    }

    public function Delete($id)
    {
        $res = new stdClass();
        DB::beginTransaction();

        try {
            $sale = $this->GetById($id);
            if($sale->status != 'a') {
                $res->code = 404;
                $res->message = "Sale not found";
                return $res;

            }

            // check sale return
            $count = SaleReturn::where('invoice', $sale->invoice)->where('status', 'a')->where('branch_id', app('branchId'))->count();
            if($count > 0) {
                $res->code = 451;
                $res->message = "Unable to delete. Sale return found";
                return $res;
            }

            // delete sale 
            $sale->status = 'd';
            $sale->save();
            $sale->delete();

            // get sale details
            $saleDetails = SaleDetail::where('sale_id', $id)->where('branch_id', app('branchId'))->get();

            // update current inventory
            foreach($saleDetails as $product) {
                $stock = CurrentInventory::where('product_id', $product->product_id)->where('branch_id', app('branchId'))->first();
                $stock->sale_quantity = $stock->sale_quantity - $product->quantity;
                $stock->save();


                // delete sale details
                $detail = SaleDetail::where('id', $product->id)->where('branch_id', app('branchId'))->first();
                $detail->status = 'd';
                $detail->save();
                $detail->delete();
            }

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            DB::rollBack();
            $res->code = 500;
            $res->message = $ex->getMessage();
        }

        DB::commit();
        return $res;
    }

    public function GenerateSaleInvoice()
    {
        $invoice = date('Y') . "000001";
        $year = date('Y');
        $sales = Sale::where('invoice', 'like', "$year%")->withTrashed()->get()->count();
        if($sales != 0){
            $newSaleId = $sales + 1;
            $zeros = array('0', '00', '000', '0000', '00000');
            $invoice = date('Y') . (strlen($newSaleId) > count($zeros) ? $newSaleId : $zeros[count($zeros) - strlen($newSaleId)] . $newSaleId);
        }

        return $invoice;
    }

    public function ValidateSale(Sale $sale)
    {
        // if($sale->customer_id == 0 || $sale->customer_id == '') return 'Select a customer';
        if($sale->employee_id == 0 || $sale->employee_id == '') return 'Select an employee';
        return '';
    }

    public function GetSaleForReturn($arg = [])
    {
        $saleId = $arg['saleId'];
        $branchId = app('branchId');

        $sale = DB::select("
            select 
                sd.*,
                p.code,
                p.name,
                (
                    select 
                        ifnull(sum(srd.quantity), 0)
                    from sale_returndetails srd
                    join sale_returns sr on sr.id = srd.sale_return_id
                    where sr.invoice = s.invoice
                    and srd.product_id = sd.product_id
                ) as returned_quantity,
                (
                    select 
                        ifnull(sum(srd.return_amount), 0)
                    from sale_returndetails srd
                    join sale_returns sr on sr.id = srd.sale_return_id
                    where sr.invoice = s.invoice
                    and srd.product_id = sd.product_id
                ) as returned_amount
            from sale_details sd
            join sales s on s.id = sd.sale_id
            join products p on p.id = sd.product_id
            where s.id = $saleId
            and s.branch_id = $branchId
            and s.deleted_at is null
        ");

        return $sale;
    }

    public function GetReturn($arg = [])
    {
        $returns = SaleReturn::with(['sale.customer', 'return_details', 'return_details.product'])->where('status', 'a')->where('branch_id', app('branchId'));

        if(isset($arg['id']) && $arg['id'] != '') {
            $returns = $returns->where('id', $arg['id']);
        }

        if(isset($arg['dateFrom']) && $arg['dateFrom'] != '' && isset($arg['dateTo']) && $arg['dateTo'] != '') {
            $returns = $returns->whereBetween('date', [$arg['dateFrom'], $arg['dateTo']]);
        }

        if(isset($arg['customerId']) && $arg['customerId'] != '') {
            $returns = $returns->whereHas('sale', function($sale) use($arg) {
                $sale->where('customer_id', $arg['customerId']);
            });

        }

        return $returns->latest()->get();        
    }

    public function InsertReturn(SaleReturn $saleReturn, $returnDetails)
    {
        $res = new stdClass();
        DB::beginTransaction();

        try {
            $branchId = app('branchId');
            $settings = CompanyProfile::first();
            $saleReturn->branch_id = $branchId;
            $saleReturn->added_by = app('userId');
            $saleReturn->currency_rate = $settings->dolor_rate;
            $saleReturn->save();

            // current inventory update
            foreach($returnDetails as $product) {
                $stock = CurrentInventory::where('product_id', $product['product_id'])->where('branch_id', app('branchId'))->first();
                $stock->sale_return = $stock->sale_return + $product['return_quantity'];
                $stock->save();
            }

            // sale detail
            $returnDetails = array_map(function($product) use($branchId) {
                return [
                    'product_id' => $product['product_id'],
                    'quantity' => $product['return_quantity'],
                    'return_amount' => $product['return_amount'],
                    'added_by' => app('userId'),
                    'branch_id' => $branchId
                ];
            }, $returnDetails);

            $saleReturn->return_details()->createMany($returnDetails);

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            DB::rollBack();
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        DB::commit();
        return $res;
    }
}
