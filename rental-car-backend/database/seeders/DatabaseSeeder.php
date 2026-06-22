<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\Role::create(['role_name' => 'admin']);
        \App\Models\Role::create(['role_name' => 'customer']);

        $suv = \App\Models\VehicleType::create(['type_name' => 'SUV']);
        $sedan = \App\Models\VehicleType::create(['type_name' => 'Sedan']);

        \App\Models\Vehicle::create([
            'vehicle_type_id' => $suv->id,
            'name' => 'Toyota Avanza',
            'plate_number' => 'B 1234 ABC',
            'price_per_day' => 350000,
            'status' => 'available'
        ]);

        \App\Models\Vehicle::create([
            'vehicle_type_id' => $sedan->id,
            'name' => 'Honda Civic',
            'plate_number' => 'B 9999 XYZ',
            'price_per_day' => 700000,
            'status' => 'available'
        ]);
    }
}
