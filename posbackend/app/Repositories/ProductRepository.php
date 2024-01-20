<?php
namespace App\Repositories;

use App\Repositories\CurrentInventoryRepository;
use App\Repositories\CompanyProfileRepository;
use App\Models\PurchaseReturndetail;
use Illuminate\Support\Facades\DB;
use App\Models\CurrentInventory;
use App\Models\SaleReturndetail;
use App\Models\PurchaseDetail;
use App\Models\DamageDetail;
use App\Models\SaleDetail;
use App\Models\Category;
use App\Models\Purchase;
use App\Models\Product;
use App\Models\ProductLog;
use App\Models\Brand;
use App\Models\Employee;
use App\Models\Price;
use App\Models\Supplier;
use App\Models\Unit;
use Exception;
use stdClass;
use Log;

class ProductRepository
{
    public $currentInventoryRepo;
    public $companyProfileRepo;

    public function __construct(){
        $this->currentInventoryRepo = new CurrentInventoryRepository;
        $this->companyProfileRepo   = new CompanyProfileRepository;
    }

    public function Get($arg = [])
    {
        $product = Product::with('category')
                    ->with('brand')
                    ->with('unit')
                    ->with('purchase_detail:id,product_id,purchase_rate_SRD,purchase_rate_USD,quantity')
                    ->withSum(['purchase_detail' => function ($query) {
                        $query->select(DB::raw('ROUND(SUM(purchase_rate_SRD) / SUM(quantity),3) as avarage_srd'));
                    }], 'avarage_srd')
                    ->withSum(['purchase_detail' => function ($query) {
                        $query->select(DB::raw('ROUND(SUM(total_usd) / SUM(quantity),3) as avarage_usd'));
                    }], 'avarage_usd')
                    ->where('branch_id', app('branchId'));

        if(isset($arg['id'])) {
            $product = $product->where('id', $arg['id']);
        }

        if(isset($arg['brandId'])) {
            $product = $product->where('brand_id', $arg['brandId']);
        }

        if(isset($arg['categoryId'])) {
            $product = $product->where('category_id', $arg['categoryId']);
        }

        if(isset($arg['price'])) {
            $product = $product->whereBetween('sale_rate', $arg['price']);
        }
        return $product->latest()->get();
    }

    public function GetById($id)
    {
        return Product::where('id', $id)->first();
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
    public function bulkImportProduct($products) {
        
        $res            = new stdClass();
        // return $res = $products['products'];
        $branchId       = app('branchId');
        $companyProfile = $this->companyProfileRepo->Get();
        $exchangeRate   = $companyProfile->dolor_rate;

        try {
            DB::beginTransaction();
            $total_ammount = 0;
            foreach ($products['products'] as $key => $product) {
                $brand = Brand::updateOrCreate([
                    'name' => $product['brand'],
                    'branch_id' => $branchId,
                ], [
                    'name' => $product['brand'],
                    'branch_id' => $branchId,
                ]);

                $category = Category::updateOrCreate([
                    'name' => $product['category'],
                    'branch_id' => $branchId,
                ], [
                    'name' => $product['category'],
                    'branch_id' => $branchId,
                ]);

                $unit = Unit::updateOrCreate([
                    'name' => $product['unit'],
                ], [
                    'name' => $product['unit'],
                ]);

                Product::updateOrCreate(
                    ['name' => $product['name']],
                    [
                        'name'           => $product['name'],
                        'code'           => DB::raw('IFNULL(code, "' . $this->GenerateProductCode() . '")'),
                        'barcode'        => isset($product['barcode']) ? $product['barcode'] : '',
                        'brand_id'       => $brand->id,
                        'category_id'    => $category->id,
                        'description'    => $product['description'],
                        'low_stock_qty'  => $product['low_stock_qty'],
                        'unit_id'        => $unit->id,
                        'branch_id'      => $branchId,
                    ]
                );
            }

            DB::commit();
            $res->message = 'Sync successfully';
            $res->code = 200;

        } catch (\exception $ex) {
            DB::rollback();
            Log::emergency($ex);
            $res->code = 500;
            $res->message = $ex->getMessage();
        }

        return $res;
    }
    public function bulkImportPurchase($products) {
        
        $res            = new stdClass();
        // return $res = $products['products'];
        $branchId       = app('branchId');
        $companyProfile = $this->companyProfileRepo->Get();
        $exchangeRate   = $companyProfile->dolor_rate;

        try {
            DB::beginTransaction();
            $total_ammount = 0;
            $productIds = []; 
            foreach ($products['products'] as $key => $product) {
                if($key == 0){
                    $suppliar = Supplier::select('id','code')->where('code', $product['supplier_code'])->first();
                    $employe = Employee::select('id','emp_id')->where('emp_id', $product['employe_code'])->first();
                    if(!$suppliar || !$employe){
                        throw new Exception('Supplier or Employee not found');
                    }else{
                        $purchase = new Purchase;
                        $purchase->invoice =  $this->GeneratePurchaseInvoice();
                        $purchase->branch_id = $branchId; 
                        $purchase->added_by = app('userId'); 
                        $purchase->date = date('Y-m-d');
                        $purchase->exchange_rate= $exchangeRate;
                        $purchase->supplier_id = $suppliar->id;
                        $purchase->employee_id = $employe->id;
                        $purchase->save();
                    }
                }
                $brand = Brand::updateOrCreate([
                    'name' => $product['brand'],
                    'branch_id' => $branchId,
                ], [
                    'name' => $product['brand'],
                    'branch_id' => $branchId,
                ]);

                $category = Category::updateOrCreate([
                    'name' => $product['category'],
                    'branch_id' => $branchId,
                ], [
                    'name' => $product['category'],
                    'branch_id' => $branchId,
                ]);

                $unit = Unit::updateOrCreate([
                    'name' => $product['unit'],
                ], [
                    'name' => $product['unit'],
                ]);

                $savedProduct = Product::updateOrCreate([
                    'name' => $product['name'],
                ], [
                    'code'           => DB::raw('IFNULL(code, "' . $this->GenerateProductCode() . '")'),
                    'name'           => $product['name'],
                    'barcode'        => isset($product['barcode']) ? $product['barcode'] : '',
                    'brand_id'       => $brand->id,
                    'category_id'    => $category->id,
                    'description' => $product['description'],
                    'purchase_rate'  => $product['purchase_rate_USD'],
                    'sale_rate'      => $product['sale_rate_USD'],
                    'wholesale_rate' => $product['wholesale_rate_USD'],
                    'low_stock_qty'  => $product['low_stock_qty'],
                    'unit_id'        => $unit->id,
                    'branch_id'      => $branchId,
                ]);
                
                
                if (isset($product['purchase_qty']) && $product['purchase_qty'] > 0) {
                    
                    $purchaseDetail = PurchaseDetail::firstOrCreate(
                        [
                            'product_id' => $savedProduct->id,
                            'purchase_id' => $purchase->id,
                        ],[
                        'purchase_rate_usd' => $savedProduct->purchase_rate,
                        'purchase_rate_srd' => $savedProduct->purchase_rate * $exchangeRate,
                        'sale_rate'     => $savedProduct->sale_rate,
                        'quantity'      => $product['purchase_qty'],
                        'total_usd'         => (((int)$product['purchase_qty'] * (float)$savedProduct->purchase_rate)),
                        'total_srd'         => (((int)$product['purchase_qty'] * (float)$savedProduct->purchase_rate) * $exchangeRate),
                        'added_by'      => app('userId'),
                        'branch_id'     => app('branchId'),
                    ]);
                    $total_ammount = $total_ammount + $purchaseDetail->total_srd;

                    if (!in_array($purchaseDetail->product_id, $productIds)) {
                        $curect_inventory = CurrentInventory::select('id','product_id','purchase_quantity','current_stock')->where('product_id', $purchaseDetail->product_id)->first();
                        
                        if ($curect_inventory) {
                            $curect_inventory->purchase_quantity = $curect_inventory->purchase_quantity + $purchaseDetail->quantity;
                            $curect_inventory->current_stock = $curect_inventory->current_stock + $purchaseDetail->quantity;
                            $curect_inventory->save();
                        } else {
                            // Record not found, create a new record
                            $new_inventory = new CurrentInventory();
                            $new_inventory->product_id = $purchaseDetail->product_id;
                            $new_inventory->purchase_quantity = $purchaseDetail->quantity;
                            $new_inventory->current_stock = $purchaseDetail->quantity;
                            $new_inventory->save();
                        }
                        $productIds[] = $purchaseDetail->product_id;
                    }
                    
                }
            }
            Purchase::where('id',$purchase->id)->update([
                'total'=> $total_ammount,
                'sub_total'=> $total_ammount,
                'paid'=> $total_ammount,
            ]);

            DB::commit();
            $res->message = 'Sync successfully';
            $res->code = 200;

        } catch (\exception $ex) {
            DB::rollback();
            Log::emergency($ex);
            $res->code = 500;
            $res->message = $ex->getMessage();
        }

        return $res;
    }
    public function Insert(Product $product)
    {
        $res = new stdClass();

        try {
            $branchId = app('branchId');
            DB::beginTransaction();
            $validation = $this->ValidateProduct($product);
            if(strlen($validation) != 0) {
                $res->code = 406;
                $res->message = $validation;
                return $res;
            }

            $duplicateName = Product::where('name', $product->name)->where('branch_id', $branchId)->first();
            if($duplicateName) {
                $res->code = 409;
                $res->message = $duplicateName->name . " already exists";
                return $res;
            }

            $duplicateProduct = Product::where('code', $product->code)->first();
            if($duplicateProduct) {
                $product->code = $this->GenerateProductCode();
            }

            $product->branch_id = $branchId;
            $product->added_by = app('userId');
            $product->save();

            // $priceExist = Price::where('product_id', $product->id)
            //     ->where('branch_id', $branchId)
            //     ->where('price', $product['purchase_rate'])
            //     ->first();

            // if(empty($priceExist)) {
            //     Price::create([
            //         'product_id' => $product->id,
            //         // 'branch_id' => $branchId,
            //         'price' => $product['purchase_rate'],
            //         'added_by' => app('userId'),
            //         // 'affected_at' => date('Y-m-d H:i:s'),
            //         'affected_at' => now(),
            //     ]);
            // }

            $res->code = 200;
            $res->message = "Saved successfully";
            DB::commit();
        } catch(Exception $ex) {
            DB::rollBack();
            $res->code = 500;
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Update(Product $product)
    {
        $res = new stdClass();

        try {
            $branchId = app('branchId');

            $validation = $this->ValidateProduct($product);
            if(strlen($validation) != 0) {
                $res->code = 406;
                $res->message = $validation;
                return $res;
            }

            $duplicateName = Product::where('name', $product->name)->where('id', '!=', $product->id)->where('branch_id', $branchId)->first();
            if($duplicateName) {
                $res->code = 409;
                $res->message = $duplicateName->name . " already exists";
                return $res;
            }

            $duplicateProduct = Product::where('code', $product->code)->where('id', '!=', $product->id)->first();
            if($duplicateProduct) {
                $product->code = $this->GenerateProductCode();
            }

            $product->branch_id = $branchId;
            $product->updated_by = app('userId');
            $product->save();

            $res->code = 200;
            $res->message = "Updated successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Delete($id)
    {
        $res = new stdClass();
        try {
            $countPurchase = PurchaseDetail::where('product_id', $id)->where('status', 'a')->count();
            if($countPurchase > 0) {
                $res->code = 451;
                $res->message = "Unable to delete. Already purchase found";
                return $res;
            }

            $countPurReturn = PurchaseReturndetail::where('product_id', $id)->where('status', 'a')->count();
            if($countPurReturn > 0) {
                $res->code = 451;
                $res->message = "Unable to delete. Already purchase return found";
                return $res;
            }

            $countSale = PurchaseDetail::where('product_id', $id)->where('status', 'a')->count();
            if($countSale > 0) {
                $res->code = 451;
                $res->message = "Unable to delete. Already sale found";
                return $res;
            }

            $countSaleReturn = SaleReturndetail::where('product_id', $id)->where('status', 'a')->count();
            if($countSaleReturn > 0) {
                $res->code = 451;
                $res->message = "Unable to delete. Already sale return found";
                return $res;
            }

            $product = $this->GetById($id);
            $product->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function GenerateProductCode()
    {
        $product = Product::orderBy('id', 'desc');
        $productId = ($product->count() == 0 ? 0 : $product->first()->id) + 1;
        $zeros = 5 - strlen($productId);
        $newProductCode = "P";
        for($i = 1; $i <= $zeros; $i++) $newProductCode .= '0';
        $newProductCode .= $productId;
        return $newProductCode;
    }

    public function lowStockProducts($arg = []) {
        $branchId = app('branchId');
        $query = Product::query();
        if(isset($arg['id'])) {
            $query->where('id', $arg['id']);
        }

        if(isset($arg['brandId'])) {
            $query->where('brand_id', $arg['brandId']);
        }

        if(isset($arg['categoryId'])) {
            $query->where('category_id', $arg['categoryId']);
        }

        if(isset($arg['price'])) {
            $query->whereBetween('sale_rate', $arg['price']);
        }
        $product = CurrentInventory::whereIn('product_id', $query->pluck('id'))->with(['product', 'product.category', 'product.brand'])->where('branch_id', $branchId);

        $product = $product->get()->map(function($item) {
            $item->current_quantity = ($item->purchase_quantity + $item->sale_return + $item->transfer_to_quantity) - ($item->purchase_return + $item->sale_quantity + $item->transfer_from_quantity + $item->damage_quantity);
            $item->stock_value = $item->current_quantity * $item->product->purchase_rate;
            return $item;
        })->filter(function($item) {
            if ($item->product->low_stock_qty == null) {
                return false;
            }
            if ($item->current_quantity <= $item->product->low_stock_qty) {
                return $item;
            }
            return false;
        });
        $pdt = [];
        foreach (collect($product) as $item) {
            $pdt[] = $item;
        }
        return $pdt;
    }

    public function ValidateProduct(Product $product)
    {
        if($product->name == '') return 'Name is required';

        if($product->category_id  == '') return 'Category is required';

        if($product->brand_id  == '') return 'Brand is required';

        if($product->unit_id  == '') return 'Unit is required';

        // if($product->purchase_rate  == '' || $product->purchase_rate == 0) return 'Purchase rate is required';

        // if($product->sale_rate  == '' || $product->sale_rate == 0) return 'Sale rate is required';

        return '';
    }

    public function GetCurrentStock($arg = [])
    {
        $product = CurrentInventory::where('product_id', $arg['productId'])->first();

        // if(isset($arg['productId'])) {
        //     $product = $product->where('product_id', $arg['productId']);
        // }

        // $product = $product->get()->map(function($item) {
        //     $item->current_quantity = ($item->purchase_quantity + $item->sale_return + $item->transfer_to_quantity) - ($item->purchase_return + $item->sale_quantity + $item->transfer_from_quantity + $item->damage_quantity);
        //     $item->stock_value = $item->current_quantity * $item->product->purchase_rate;
        //     return $item;
        // });

        return $product;
    }

    public function GetTotalStock() {
        $product = CurrentInventory::with([
            'product_data' => function ($query) {
                $query->select('id', 'name','category_id','brand_id','unit_id','code'); 
            },
            'product_data.brand' => function ($query) {
                $query->select('id', 'name'); 
            },
            'product_data.unit' => function ($query) {
                $query->select('id', 'name'); 
            },
            'product_data.category' => function ($query) {
                $query->select('id', 'name'); 
            },
            'product_data.purchase_detail' => function ($query) {
                $query->select('product_id', DB::raw('ROUND(SUM(purchase_rate_usd * quantity) / SUM(quantity),3) as avarage_usd'))
                ->groupBy('product_id'); 
            }
        ])->get();
        return $product;
    }

    public function Ledger($arg = [])
    {
        $res = new stdClass;
        $branchId = app('branchId');

        $sale = DB::table('sale_details as sd')
                    ->selectRaw("
                        'b' as sequence,
                        sm.created_at,
                        sm.date,
                        concat('Sales - ', sm.invoice, ' - ', c.name) as description,
                        sd.sale_rate as rate,
                        0 as in_quantity,
                        sd.quantity as out_quantity
                    ")
                    ->join('sales as sm', 'sm.id', '=', 'sd.sale_id')
                    ->join('customers as c', 'c.id', '=', 'sm.customer_id')
                    ->where('sd.status', 'a')
                    ->where('sd.product_id', $arg['productId'])
                    ->whereNull('sd.deleted_at')
                    ->where('sd.branch_id', $branchId);

        $purReturn = DB::table('purchase_returndetails as prd')
                        ->selectRaw("
                            'c' as sequence,
                            pr.created_at,
                            pr.date,
                            concat('Purchase return -', pr.invoice) as description,
                            (prd.return_amount / prd.quantity)as rate,
                            0 as in_quantity,
                            prd.quantity as out_quantity
                         ")
                        ->join('purchase_returns as pr', 'pr.id', '=', 'prd.purchase_return_id')
                        ->where('prd.status', 'a')
                        ->whereNull('prd.deleted_at')
                        ->where('prd.product_id', $arg['productId'])
                        ->where('prd.branch_id', $branchId);

        $saleReturn = DB::table('sale_returndetails as srd')
                       ->selectRaw("
                            'd' as sequence,
                            sr.created_at,
                            sr.date,
                            concat('Sales return -', sr.invoice) as description,
                            (srd.return_amount / srd.quantity)as rate,
                            srd.quantity as in_quantity,
                            0 as out_quantity
                       ")
                       ->join('sale_returns as sr', 'sr.id', '=', 'srd.sale_return_id')
                       ->where('srd.status', 'a')
                       ->whereNull('srd.deleted_at')
                       ->where('srd.product_id', $arg['productId'])
                       ->where('srd.branch_id', $branchId);

        $damage = DB::table('damage_details as dd')
                    ->selectRaw("
                        'e' as sequence,
                        d.created_at,
                        d.date,
                        concat('Damage -', d.invoice) as description,
                        dd.rate,
                        0 as in_quantity,
                        dd.quantity as out_quantity
                    ")
                    ->join('damages as d', 'd.id', '=', 'dd.damage_id')
                    ->where('dd.status', 'a')
                    ->whereNull('dd.deleted_at')
                    ->where('dd.product_id', $arg['productId'])
                    ->where('dd.branch_id', $branchId);

        $purchase = DB::table('purchase_details as pd')
                    ->selectRaw("
                        'a' as sequence,
                        pm.created_at,
                        pm.date,
                        concat('Purchase -', pm.invoice, ' - ', suppliers.name) as description,
                        pd.purchase_rate as rate,
                        pd.quantity as in_quantity,
                        0 as out_quantity
                    ")
                    ->join('purchases as pm', 'pm.id' , '=', 'pd.purchase_id')
                    ->join('suppliers', 'suppliers.id' , '=', 'pm.supplier_id')
                    ->where('pd.status', 'a')
                    ->where('pd.product_id', $arg['productId'])
                    ->where('pd.branch_id', $branchId)
                    ->whereNull('pd.deleted_at');

        $ledgers = DB::table('purchase_details')
                    ->selectRaw("
                        'a' as sequence,
                        created_at,
                        DATE_FORMAT(created_at, '%Y-%m-%d') as date,
                        'Bulk Upload' as description,
                        purchase_rate as rate,
                        quantity as in_quantity,
                        0 as out_quantity")
                    ->whereNull('purchase_id')
                    ->where('status', 'a')
                    ->where('product_id', $arg['productId'])
                    ->where('branch_id', $branchId)
                    ->whereNull('deleted_at')
                    ->union($purchase)
                    ->union($sale)
                    ->union($purReturn)
                    ->union($saleReturn)
                    ->union($damage)
                    ->orderBy('created_at')
                    ->get()->toArray();

        $openingStock = 0;

        $ledgers = array_map(function($key, $ledger) use($ledgers) {
            $ledger->stock = $key == 0 ? $ledger->in_quantity - $ledger->out_quantity : $ledgers[$key - 1]->stock + ($ledger->in_quantity - $ledger->out_quantity);
            return $ledger;
        }, array_keys($ledgers), $ledgers);


        if(isset($arg['dateFrom']) && isset($arg['dateTo'])) {
            $previousStock = array_filter($ledgers, function($ledger) use ($arg){
                return $ledger->date < $arg['dateFrom'];
            });
            $previousStock = (object) $previousStock;

            $openingStock = (count((array)$previousStock) > 0) ? (empty($previousStock) ? 0 : end($previousStock)->stock) : 0;

            $ledgers = array_filter($ledgers, function($ledger) use ($arg){
                return $ledger->date >= $arg['dateFrom'] && $ledger->date <= $arg['dateTo'];
            });

            $ledgers = array_values($ledgers);
        }

        $res->ledgers = $ledgers;
        $res->openingStock = $openingStock;
        return $res;
    }
    public function getStocksHistory($arg = []){
        $product = Product::with('purchase_detail:id,product_id,purchase_rate_SRD,purchase_rate_USD,purchase_quantity,created_at,totall_purchase_rate_USD')
                    ->where('id',$arg['id'])
                    ->first();
        return $product;
    } 
    public function stockUpdate($arg = []){
        $res            = new stdClass();
        try {
            DB::beginTransaction();
             CurrentInventory::where('product_id',$arg['product_id'])->Update(['purchase_quantity' => 'purchase_quantity - '. $arg['quantity']]);
            DB::commit();
            $res->message = 'Success';
            $res->code = 200;

        } catch (\exception $ex) {
            DB::rollback();
            Log::emergency($ex);
            $res->code = 500;
            $res->message = $ex->getMessage();
        }

        return $res;
    } 
}
