<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CurrentInventory extends Model
{
    use HasFactory;

    protected $guarded = [];

    public $timestamps = false;

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function scopeProductWiseFilter($query, $productId) {
        $query->where("product_id", $productId);
    }

    public function scopeBranchWiseFilter($query) {
        $branchId = app('branchId');
        $query->where("branch_id", $branchId);
    }
    public function product_data(){
        return $this->hasOne(Product::class,'id','product_id');
    }
}
