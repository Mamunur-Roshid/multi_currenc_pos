<?php
namespace App\Repositories;

use App\Models\Damage;
use App\Models\DamageDetail;
use App\Models\CurrentInventory;
use stdClass;
use Exception;
use Illuminate\Support\Facades\DB;

class DamageRepository {
    public function Get($arg = [])
    {
        $damages = Damage::with(['added_by', 'damage_details.product']);

        if(isset($arg['id']) && $arg['id'] != '') {
            $damages = $damages->where('id', $arg['id']);
        }

        if(isset($arg['dateFrom']) && $arg['dateFrom'] != '' && isset($arg['dateTo']) && $arg['dateTo'] != '') {
            $damages = $damages->whereBetween('date', [$arg['dateFrom'], $arg['dateTo']]);
        }

        return $damages->latest()->get();
    }

    public function GetById($id)
    {
        return Damage::where('id', $id)->first();
    }

    public function Insert(Damage $damage, $damageDetails)
    {
        $res = new stdClass();
        DB::beginTransaction();

        try {
            $branchId = 1;

            $duplicateInvoice = Damage::where('invoice', $damage->invoice)->first();
            if($duplicateInvoice) {
                $damage->invoice = $this->GenerateDamageInvoice();
            }

            $damage->branch_id = $branchId;
            $damage->added_by = 1;
            $damage->save();

            // damage$damage detail
            $damageDetails = array_map(function($product) use($branchId) {
                return [
                    'product_id' => $product['id'],
                    'rate' => $product['rate'],
                    'quantity' => $product['quantity'],
                    'total' => $product['total'],
                    'branch_id' => $branchId
                ];
            }, $damageDetails);

            $damage->damage_details()->createMany($damageDetails);

            // current inventory update
            foreach($damageDetails as $product) {
                $countProduct = CurrentInventory::where('product_id', $product['product_id'])->where('branch_id', $branchId)->count();
                
                if($countProduct > 0) {
                    $stock = CurrentInventory::where('product_id', $product['product_id'])->first();
                    $stock->damage_quantity = $stock->damage_quantity + $product['quantity'];
                    $stock->save();
                    
                } else {
                    $stock = new CurrentInventory();
                    $stock->product_id = $product['product_id'];
                    $stock->damage_quantity = $stock->damage_quantity + $product['quantity'];
                    $stock->branch_id = $branchId;
                    $stock->save();
                }
            }

            $res->code = 200;
            $res->id = $damage->id;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            DB::rollBack();
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        DB::commit();
        return $res;
    }

    public function Update(Damage $damage, $damageDetails)
    {
        $res = new stdClass();
        DB::beginTransaction();

        try {
            $branchId = 1;

            $duplicateInvoice = Damage::where('invoice', $damage->invoice)->where('id', '!=', $damage->id)->first();
            if($duplicateInvoice) {
                $damage->invoice = $this->GenerateDamageInvoice();
            }

            $damage->branch_id = $branchId;
            $damage->updated_by = 1;
            $damage->save();

            // purchase details
            $oldDetails = DamageDetail::where('damage_id', $damage->id)->where('branch_id', $branchId)->get(); 
            
            // remove current inventory
            foreach($oldDetails as $product) {
                $stock = CurrentInventory::where('product_id', $product->product_id)->where('branch_id', $branchId)->first();
                $stock->damage_quantity = $stock->damage_quantity - $product->quantity;
                $stock->save();
            }

            // delete old detail
            DamageDetail::where('damage_id', $damage->id)->forceDelete();

            // purchase detail
            $damageDetails = array_map(function($product) use($branchId) {
                return [
                    'product_id' => $product['id'],
                    'rate' => $product['rate'],
                    'quantity' => $product['quantity'],
                    'total' => $product['total'],
                    'branch_id' => $branchId
                ];
            }, $damageDetails);

            $damage->damage_details()->createMany($damageDetails);

            // current inventory update
            foreach($damageDetails as $product) {
                $countProduct = CurrentInventory::where('product_id', $product['product_id'])->where('branch_id', $branchId)->count();
                
                if($countProduct > 0) {
                    $stock = CurrentInventory::where('product_id', $product['product_id'])->first();
                    $stock->damage_quantity = $stock->damage_quantity + $product['quantity'];
                    $stock->save();
                    
                } else {
                    $stock = new CurrentInventory();
                    $stock->product_id = $product['product_id'];
                    $stock->damage_quantity = $stock->damage_quantity + $product['quantity'];
                    $stock->branch_id = $branchId;
                    $stock->save();
                }
            }

            $res->code = 200;
            $res->id = $damage->id;
            $res->message = "Update successfully";
        } catch(Exception $ex) {
            DB::rollBack();
            $res->code = $ex->getCode();
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
            $damage = $this->GetById($id);
            if($damage->status != 'a') {
                $res->code = 404;
                $res->message = "Damage is not found";
                return $res;

            }

            // delete damage
            $damage->status = 'd';
            $damage->save();
            $damage->delete();

            // get damage details
            $damageDetails = DamageDetail::where('damage_id', $id)->get();

            // update current inventory
            foreach($damageDetails as $product) {
                $stock = CurrentInventory::where('product_id', $product->product_id)->first();
                $stock->damage_quantity = $stock->damage_quantity - $product->quantity;
                $stock->save();


                // delete damage$damage details
                $detail = DamageDetail::where('id', $product->id)->first();
                $detail->status = 'd';
                $detail->save();
                $detail->delete();
            }

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

    public function GenerateDamageInvoice()
    {
        $invoice = date('Y') . "000001";
        $year = date('Y');
        $damages = Damage::where('invoice', 'like', "$year%")->withTrashed()->get()->count();
        if($damages != 0){
            $newDamageId = $damages + 1;
            $zeros = array('0', '00', '000', '0000', '00000');
            $invoice = date('Y') . (strlen($newDamageId) > count($zeros) ? $newDamageId : $zeros[count($zeros) - strlen($newDamageId)] . $newDamageId);
        }

        return $invoice;
    }
}