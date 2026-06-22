<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = ['vehicle_type_id', 'name', 'plate_number', 'price_per_day', 'status'];

    public function vehicleType()
    {
        return $this->belongsTo(VehicleType::class, 'vehicle_type_id');
    }

    public function rentals()
    {
        return $this->hasMany(Rental::class, 'vehicle_id');
    }
}
