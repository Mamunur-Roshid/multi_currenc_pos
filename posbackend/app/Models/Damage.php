<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Damage extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function damage_details()
    {
        return $this->hasMany(DamageDetail::class);
    }

    public function added_by()
    {
        return $this->belongsTo(User::class, 'added_by', 'id');
    }
}
