<?php

namespace App\Repositories;
use App\Models\CurrentInventory;
use Log;
use DB;
class CurrentInventoryRepository {

    public function totalPurchasedQty($productId) : mixed {
        $totalPurchasedQty = CurrentInventory::select(DB::raw('SUM(purchase_quantity) as total_purchased_qty'))->productWiseFilter($productId)->branchWiseFilter()->first();
        return (int)$totalPurchasedQty->total_purchased_qty ?? 0;
    }

    public function updateSingleRow($productId, $purchaseQty = 0, $purchaseReturnQty = 0, $saleQty = 0, $saleReturnQty = 0, $transferFromQty = 0, $transferToQty = 0, $damageQty = 0) {
        
        $currentInventory = CurrentInventory::productWiseFilter($productId)->branchWiseFilter()->first();

        if (!$currentInventory) {
            $currentInventory = new CurrentInventory;
        }

        $currentInventory->product_id = $productId;
        $currentInventory->branch_id  = app('branchId');

        if ($purchaseQty) {
            $currentInventory->purchase_quantity = (int)$currentInventory->purchase_quantity + (int)$purchaseQty;
        }

        $currentInventory->save();
    }
}