<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CashTransaction extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function expense()
    {
        return $this->belongsTo(Expense::class, 'account_id', 'id');
    }

    public function added_by()
    {
        return $this->belongsTo(User::class, 'added_by', 'id');
    }
}
