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
        $admin = \App\Models\Role::create(['role_name' => 'admin']);
        $customer = \App\Models\Role::create(['role_name' => 'customer']);

        \App\Models\User::create([
            'name' => 'Faisal',
            'email' => 'faisal@gmail.com',
            'password' => bcrypt('pw12345'),
            'role_id' => $customer->id 
        ]);

        \App\Models\User::create([
            'name' => 'Super Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('pw12345'),
            'role_id' => $admin->id 
        ]);

        $suv = \App\Models\VehicleType::create(['type_name' => 'SUV']);
        $sedan = \App\Models\VehicleType::create(['type_name' => 'Sedan']);
        $mpv = \App\Models\VehicleType::create(['type_name' => 'MPV']); 
        $hatch = \App\Models\VehicleType::create(['type_name' => 'Hatchback']);

        // 1. Toyota Avanza
        \App\Models\Vehicle::create([
            'vehicle_type_id' => $suv->id,
            'name' => 'Toyota Avanza',
            'plate_number' => 'B 1234 ABC',
            'price_per_day' => 350000,
            'status' => 'available',
            'foto_mobil' => 'avanza.jpg',
            'kapasitas' => '7 Penumpang',
            'transmisi' => 'Otomatis',
            'bahan_bakar' => 'Bensin'
        ]);

        // 2. Honda Civic
        \App\Models\Vehicle::create([
            'vehicle_type_id' => $sedan->id,
            'name' => 'Honda Civic',
            'plate_number' => 'B 9999 XYZ',
            'price_per_day' => 700000,
            'status' => 'available',
            'foto_mobil' => 'civic.jpg',
            'kapasitas' => '5 Penumpang',
            'transmisi' => 'Otomatis',
            'bahan_bakar' => 'Bensin (Irit)'
        ]);

        // 3. Mitsubishi Xpander
        \App\Models\Vehicle::create([
            'vehicle_type_id' => $mpv->id,
            'name' => 'Mitsubishi Xpander',
            'plate_number' => 'B 2233 ZXC',
            'price_per_day' => 450000,
            'status' => 'available',
            'foto_mobil' => 'xpander.jpg',
            'kapasitas' => '7 Penumpang',
            'transmisi' => 'Otomatis',
            'bahan_bakar' => 'Bensin'
        ]);

        // 4. Toyota Fortuner
        \App\Models\Vehicle::create([
            'vehicle_type_id' => $suv->id,
            'name' => 'Toyota Fortuner',
            'plate_number' => 'B 4444 QWE',
            'price_per_day' => 900000,
            'status' => 'available',
            'foto_mobil' => 'fortuner.jpg',
            'kapasitas' => '7 Penumpang',
            'transmisi' => 'Otomatis',
            'bahan_bakar' => 'Diesel'
        ]);

        // 5. Suzuki Ertiga
        \App\Models\Vehicle::create([
            'vehicle_type_id' => $mpv->id,
            'name' => 'Suzuki Ertiga',
            'plate_number' => 'B 5555 ASD',
            'price_per_day' => 450000,
            'status' => 'available',
            'foto_mobil' => 'ertiga.jpg',
            'kapasitas' => '7 Penumpang',
            'transmisi' => 'Otomatis',
            'bahan_bakar' => 'Bensin'
        ]);

        // 6. Honda Brio
        \App\Models\Vehicle::create([
            'vehicle_type_id' => $hatch->id,
            'name' => 'Honda Brio',
            'plate_number' => 'B 6666 FGH',
            'price_per_day' => 300000,
            'status' => 'available',
            'foto_mobil' => 'brio.jpg',
            'kapasitas' => '5 Penumpang',
            'transmisi' => 'Otomatis',
            'bahan_bakar' => 'Bensin (Irit)'
        ]);

        // 7. Mitsubishi Pajero
        \App\Models\Vehicle::create([
            'vehicle_type_id' => $suv->id,
            'name' => 'Mitsubishi Pajero',
            'plate_number' => 'B 7777 JKL',
            'price_per_day' => 950000,
            'status' => 'available',
            'foto_mobil' => 'pajero.jpg',
            'kapasitas' => '7 Penumpang',
            'transmisi' => 'Otomatis',
            'bahan_bakar' => 'Diesel'
        ]);

        // 8. Toyota Raize
        \App\Models\Vehicle::create([
            'vehicle_type_id' => $suv->id,
            'name' => 'Toyota Raize',
            'plate_number' => 'B 8888 RTY',
            'price_per_day' => 500000,
            'status' => 'available',
            'foto_mobil' => 'raize.jpg',
            'kapasitas' => '5 Penumpang',
            'transmisi' => 'Otomatis',
            'bahan_bakar' => 'Bensin'
        ]);

        // 9. Daihatsu Sigra
        \App\Models\Vehicle::create([
            'vehicle_type_id' => $mpv->id,
            'name' => 'Daihatsu Sigra',
            'plate_number' => 'B 9990 UIO',
            'price_per_day' => 320000,
            'status' => 'available',
            'foto_mobil' => 'sigra.jpg',
            'kapasitas' => '7 Penumpang',
            'transmisi' => 'Otomatis',
            'bahan_bakar' => 'Bensin'
        ]);

        // 10. Toyota Zenix
        \App\Models\Vehicle::create([
            'vehicle_type_id' => $hatch->id,
            'name' => 'Toyota Zenix',
            'plate_number' => 'B 1111 PAS',
            'price_per_day' => 520000,
            'status' => 'available',
            'foto_mobil' => 'zenix.jpg',
            'kapasitas' => '5 Penumpang',
            'transmisi' => 'Otomatis',
            'bahan_bakar' => 'Bensin'
        ]);

        // 11. Hyundai Creta
        \App\Models\Vehicle::create([
            'vehicle_type_id' => $suv->id,
            'name' => 'Hyundai Creta',
            'plate_number' => 'B 2222 QAZ',
            'price_per_day' => 600000,
            'status' => 'available',
            'foto_mobil' => 'creta.jpg',
            'kapasitas' => '5 Penumpang',
            'transmisi' => 'Otomatis',
            'bahan_bakar' => 'Bensin'
        ]);

        // 12. Kia Seltos
        \App\Models\Vehicle::create([
            'vehicle_type_id' => $suv->id,
            'name' => 'Kia Seltos',
            'plate_number' => 'B 3333 WSX',
            'price_per_day' => 650000,
            'status' => 'available',
            'foto_mobil' => 'seltos.jpg',
            'kapasitas' => '5 Penumpang',
            'transmisi' => 'Otomatis',
            'bahan_bakar' => 'Bensin'
        ]);
    }
}