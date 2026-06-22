<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'vehicle_id', 
        'start_date', 
        'end_date', 
        'total_price', 
        'status'
    ];

    public function user()
    {
        return $table->belongsTo(User::class, 'user_id');
    }

    public function vehicle()
    {
        return $table->belongsTo(Vehicle::class, 'vehicle_id');
    }
}