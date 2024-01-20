<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SaleReturn extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function sale()
    {
        return $this->belongsTo(Sale::class, 'invoice', 'invoice');
    }

    public function return_details()
    {
        return $this->hasMany(SaleReturndetail::class);
    }
}
