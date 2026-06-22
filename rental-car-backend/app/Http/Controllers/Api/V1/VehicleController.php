<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index()
    {
        $vehicles = Vehicle::with('vehicleType')->get();
        return response()->json([
            'success' => true,
            'message' => 'Daftar semua kendaraan berhasil diambil',
            'data'    => $vehicles
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'vehicle_type_id' => 'required|exists:vehicle_types,id',
            'name'            => 'required|string',
            'plate_number'    => 'required|string|unique:vehicles,plate_number',
            'price_per_day'   => 'required|integer',
        ]);

        $vehicle = Vehicle::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Kendaraan baru berhasil ditambahkan',
            'data'    => $vehicle
        ], 201);
    }

    public function show($id)
    {
        $vehicle = Vehicle::with('vehicleType')->find($id);

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Kendaraan tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail kendaraan ditemukan',
            'data'    => $vehicle
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Kendaraan tidak ditemukan',
            ], 404);
        }

        $vehicle->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Data kendaraan berhasil diperbarui',
            'data'    => $vehicle
        ], 200);
    }

    public function destroy($id)
    {
        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Kendaraan tidak ditemukan',
            ], 404);
        }

        $vehicle->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kendaraan berhasil dihapus dari sistem',
        ], 200);
    }
}