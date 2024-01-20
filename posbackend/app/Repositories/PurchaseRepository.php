<?php
namespace App\Repositories;
use App\Repositories\CurrentInventoryRepository;
use App\Repositories\CompanyProfileRepository;
use App\Models\PurchaseReturndetail;
use Illuminate\Support\Facades\DB;
use App\Models\CurrentInventory;
use App\Models\PurchaseDetail;
use App\Models\PurchaseReturn;
use App\Models\Purchase;
use App\Models\Product;
use App\Models\Price;
use Exception;
use Illuminate\Http\Request;
use stdClass;

class PurchaseRepository
{
    public $currentInventoryRepo;
    public $companyProfileRepo;

    public function __construct(){
        $this->currentInventoryRepo = new CurrentInventoryRepository;
        $this->companyProfileRepo   = new CompanyProfileRepository;
    }
    public function Get($arg = [])
    {
        // $purchases = Purchase::with(['supplier', 'employee', 'added_by', 'purchase_details.product'])->where('branch_id', app('branchId'));
        $purchases = Purchase::with(['supplier', 'employee', 'added_by', 'purchase_details.product' => function($q) {
            return $q->with(['unit']);
        }])->where('branch_id', app('branchId'));

        if(isset($arg['id']) && $arg['id'] != '') {
            $purchases = $purchases->where('id', $arg['id']);
        }

        if(isset($arg['dateFrom']) && $arg['dateFrom'] != '' && isset($arg['dateTo']) && $arg['dateTo'] != '') {
            $purchases = $purchases->whereBetween('date', [$arg['dateFrom'], $arg['dateTo']]);
        }

        if(isset($arg['supplierId']) && $arg['supplierId'] != '') {
            $purchases = $purchases->where('supplier_id', $arg['supplierId']);
        }

        if(isset($arg['employeeId']) && $arg['employeeId'] != '') {
            $purchases = $purchases->where('supplier_id', $arg['employeeId']);
        }

        return $purchases->latest()->get();
    }

    public function GetInvoice()
    {
       return Purchase::select('id', 'invoice')->where('status', 'a')->where('branch_id', app('branchId'))->latest()->get();
    }

    public function GetById($id)
    {
        return Purchase::where('id', $id)->where('branch_id', app('branchId'))->first();
    }

    public function Insert(Request $request)
    {
        DB::beginTransaction();
        $companyProfile = $this->companyProfileRepo->Get();
        $exchangeRate   = $companyProfile->dolor_rate;

        try {
            $branchId = app('branchId');
            $purchaseData =  $request->purchase;
            if($request->hasdelete){
                foreach ($request->hasdelete as $value) {
                    $manageData = CurrentInventory::select('id','product_id','purchase_quantity','current_stock')->where('product_id', $value['product_id'])->first();
                    $manageData->purchase_quantity = $manageData->purchase_quantity  -  $value['quantity'];
                    $manageData->current_stock = $manageData->current_stock -  $value['quantity'];
                    $manageData->save();
                    // CurrentInventory::where('product_id', $value['product_id'])->decrement('purchase_quantity', $value['quantity'])->decrement('current_stock', $value['quantity']);
                    PurchaseDetail::where('product_id', $value['product_id'])->where('purchase_id', $purchaseData['id'])->delete();
                }
            }
            if($request->changeData){
                foreach ($request->changeData as $value) {
                   $manageData = CurrentInventory::select('id','product_id','purchase_quantity','current_stock')->where('product_id', $value['product_id'])->first();
                   $manageData->purchase_quantity = $manageData->purchase_quantity +  $value['quantity_new'] - $value['quantity_old'];
                   $manageData->current_stock = $manageData->current_stock +  $value['quantity_new'] - $value['quantity_old'];
                   $manageData->save();
                }
            }
            $purchases = Purchase::updateOrCreate(
                ['id' => $purchaseData['id']],
                [
                    'invoice' => $purchaseData['invoice'],
                    'date' => $purchaseData['date'],
                    'po_no' => $purchaseData['po_no'],
                    'po_date' => $purchaseData['po_date'],
                    'sub_total' => $purchaseData['sub_total'],
                    'supplier_id' => $purchaseData['supplier_id'],
                    'employee_id' => $purchaseData['employee_id'],
                    'total' => $purchaseData['total'],
                    'transport' => $purchaseData['transport'],
                    'vat' => $purchaseData['vat'],
                    'due' => $purchaseData['due'],
                    'exchange_rate' => DB::raw('IFNULL(exchange_rate, "' . $exchangeRate . '")'),
                    'paid' => $purchaseData['paid'],
                    'discount' => $purchaseData['discount'],
                    'branch_id' => $branchId,
                    'added_by' => app('userId'),
                ]
            );
            foreach ($request->cart as  $product) {
             PurchaseDetail::updateOrCreate(
                    ['purchase_id' => $purchaseData['id'], 'product_id' => $product['id']],
                    [
                        'product_id'    => $product['id'],
                        'purchase_id'    => $purchases['id'],
                        'purchase_rate_usd' => $product['purchase_rate_usd'],
                        'sale_rate'     => $product['sale_rate'],
                        'quantity'          => $product['quantity'],
                        'total_usd'         =>  $product['total_usd'],
                        'total_srd'         =>  $product['total_srd'],
                        'added_by'      => app('userId'),
                        'branch_id'     => app('branchId'),
                ]);
                Product::where('id', $product['id'])
                        ->update([
                            'wholesale_rate' => $product['wholesale_rate_usd'],
                            'wholesale_rate_SRD' => $product['wholesale_rate_srd'], 
                            'purchase_rate' => $product['purchase_rate_usd'],
                            'sale_rate' => $product['sale_rate'],
                        ]);
                if($request->type == 'add'){
                    $new_inventory = new CurrentInventory();
                    $new_inventory->product_id = $product['id'];
                    $new_inventory->purchase_quantity = $product['quantity'];
                    $new_inventory->current_stock = $product['quantity'];
                    $new_inventory->save();
                }
            }

            $response = ['status' => 'success', 'data' => $purchases->id];
            
        } catch(Exception $ex) {
            DB::rollBack();
            $response = ['status' => 'success', 'data' => $ex->getMessage()];
        }

        DB::commit();
        return $response;
    }

    public function Update(Purchase $purchase, $purchaseDetails)
    {
        $res = new stdClass();
        DB::beginTransaction();

        try {
            $branchId = app('branchId');

            $validation = $this->ValidatePurchase($purchase);
            if(strlen($validation) != 0) {
                $res->code = 406;
                $res->message = $validation;
                return $res;
            }

            $duplicateInvoice = Purchase::where('invoice', $purchase->invoice)->where('id', '!=', $purchase->id)->where('branch_id', $branchId)->first();
            if($duplicateInvoice) {
                $purchase->invoice = $this->GeneratePurchaseInvoice();
            }

            $purchase->branch_id = $branchId;
            $purchase->updated_by = app('userId');
            $purchase->save();

            // purchase details
            $oldDetails = PurchaseDetail::where('purchase_id', $purchase->id)->where('branch_id', $branchId)->get();

            // remove current inventory
            foreach($oldDetails as $product) {
                $stock = CurrentInventory::where('product_id', $product->product_id)->where('branch_id', $branchId)->first();
                $stock->purchase_quantity = $stock->purchase_quantity - $product->quantity;
                $stock->save();
            }

            // delete old detail
            PurchaseDetail::where('purchase_id', $purchase->id)->where('branch_id', $branchId)->forceDelete();

            // purchase detail
            $purchaseDetails = array_map(function($product) use($branchId) {
                return [
                    'product_id' => $product['id'],
                    'purchase_rate' => $product['purchase_rate'],
                    'sale_rate' => $product['sale_rate'],
                    'quantity' => $product['quantity'],
                    'total' => $product['total'],
                    'branch_id' => $branchId,
                    'updated_by' => app('userId')
                ];
            }, $purchaseDetails);

            $purchase->purchase_details()->createMany($purchaseDetails);

            // current inventory update
            foreach($purchaseDetails as $product) {
                $countProduct = CurrentInventory::where('product_id', $product['product_id'])->where('branch_id', $branchId)->count();

                if($countProduct > 0) {
                    $stock = CurrentInventory::where('product_id', $product['product_id'])->where('branch_id', $branchId)->first();
                    $stock->purchase_quantity = $stock->purchase_quantity + $product['quantity'];
                    $stock->save();

                } else {
                    $stock = new CurrentInventory();
                    $stock->product_id = $product['product_id'];
                    $stock->purchase_quantity = $stock->purchase_quantity + $product['quantity'];
                    $stock->branch_id = $branchId;
                    $stock->save();
                }
            }

            $res->code = 200;
            $res->id = $purchase->id;
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
            // get purchase
            $purchase = Purchase::select('id','invoice','status')->where('id', $id)->where('status', 'a')->first();
            if(!$purchase) {
                $res->code = 404;
                $res->message = "Purchase not found";
                return $res;
            }

            // check purchase return
            $count = PurchaseReturn::where('invoice', $purchase->invoice)->where('status', 'a')->where('branch_id', app('branchId'))->count();
            if($count > 0) {
                $res->code = 451;
                $res->message = "Unable to delete. Purchase return found";
                return $res;
            }

            // delete purchase
            $purchase->status = 'd';
            $purchase->save();
            $purchase->delete();

            // get purchase details
            $purchaseDetails = PurchaseDetail::select('id','purchase_id','product_id','quantity')->where('purchase_id', $id)->get();

            // update current inventory
            foreach($purchaseDetails as $product) {
                $stock = CurrentInventory::where('product_id', $product->product_id)->first();
                $stock->purchase_quantity = $stock->purchase_quantity - $product->quantity;
                $stock->current_stock = $stock->current_stock - $product->quantity;
                $stock->save();


                // delete purchase details
                // $detail = PurchaseDetail::where('id', $product->id)->where('branch_id', app('branchId'))->first();
                // $detail->status = 'd';
                // $detail->save();

                // $detail->delete();
                
            }
            PurchaseDetail::where('purchase_id', $id)->delete();
            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            DB::rollBack();
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        DB::commit();
        return $res;
    }

    public function GeneratePurchaseInvoice()
    {
        $invoice = date('Y') . "000001";
        $year = date('Y');
        $purchases = Purchase::withTrashed()->get()->count();
        if($purchases != 0){
            $newPurchaseId = $purchases + 1;
            $zeros = array('0', '00', '000', '0000', '00000');
            $invoice = date('Y') . (strlen($newPurchaseId) > count($zeros) ? $newPurchaseId : $zeros[count($zeros) - strlen($newPurchaseId)] . $newPurchaseId);
        }
        return $invoice;
    }

    public function ValidatePurchase(Purchase $purchase)
    {
        if($purchase->supplier_id == 0 || $purchase->supplier_id == '') return 'Select a supplier';
        if($purchase->employee_id == 0 || $purchase->employee_id == '') return 'Select an employee';
        return '';
    }

    public function GetPurchaseForReturn($arg = [])
    {
        $purchaseId = $arg['purchaseId'];
        $branchId = app('branchId');

        $purchases = DB::select("
            select
                pd.*,
                p.code,
                p.name,
                (
                    select
                        ifnull(sum(prd.quantity), 0)
                    from purchase_returndetails prd
                    join purchase_returns pr on pr.id = prd.purchase_return_id
                    where pr.invoice = pm.invoice
                    and prd.product_id = pd.product_id
                ) as returned_quantity,
                (
                    select
                        ifnull(sum(prd.return_amount),0)
                    from purchase_returndetails prd
                    join purchase_returns pr on pr.id = prd.purchase_return_id
                    where pr.invoice = pm.invoice
                    and prd.product_id = pd.product_id
                ) as returned_amount
            from purchase_details pd
            join purchases pm on pm.id = pd.purchase_id
            join products p on p.id = pd.product_id
            where pm.id = $purchaseId
            and pm.branch_id = $branchId
            and pm.deleted_at is null
        ");

        return $purchases;
    }

    public function GetReturn($arg = [])
    {
        $returns = PurchaseReturn::with(['purchase.supplier', 'return_details', 'return_details.product'])->where('status', 'a')->where('branch_id', app('branchId'));

        if(isset($arg['id']) && $arg['id'] != '') {
            $returns = $returns->where('id', $arg['id']);
        }

        if(isset($arg['dateFrom']) && $arg['dateFrom'] != '' && isset($arg['dateTo']) && $arg['dateTo'] != '') {
            $returns = $returns->whereBetween('date', [$arg['dateFrom'], $arg['dateTo']]);
        }

        if(isset($arg['supplierId']) && $arg['supplierId'] != '') {
            $returns = $returns->whereHas('purchase', function($purchase) use($arg) {
                $purchase->where('supplier_id', $arg['supplierId']);
            });
        }

        return $returns->get();
    }

    public function InsertReturn(PurchaseReturn $purReturn, $returnDetails)
    {
        $res = new stdClass();
        DB::beginTransaction();

        try {
            $branchId = app('branchId');

            $purReturn->branch_id = $branchId;
            $purReturn->added_by = app('userId');
            $purReturn->save();

            // current inventory update
            foreach($returnDetails as $product) {
                $stock = CurrentInventory::where('product_id', $product['product_id'])->where('branch_id', $branchId)->first();
                $stock->purchase_return = $stock->purchase_return + $product['return_quantity'];
                $stock->save();
            }

            // purchase detail
            $returnDetails = array_map(function($product) use($branchId) {
                return [
                    'product_id' => $product['product_id'],
                    'quantity' => $product['return_quantity'],
                    'return_amount' => $product['return_amount'],
                    'added_by' => app('userId'),
                    'branch_id' => $branchId
                ];
            }, $returnDetails);

            $purReturn->return_details()->createMany($returnDetails);

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
