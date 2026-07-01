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
        \Log::info('Store vehicle called', $request->all());
        \Log::info('Has file:', ['hasFile' => $request->hasFile('foto_mobil')]);
        
        $request->validate([
            'vehicle_type_id' => 'required|exists:vehicle_types,id',
            'name'            => 'required|string',
            'plate_number'    => 'required|string|unique:vehicles,plate_number',
            'price_per_day'   => 'required|integer',
            'foto_mobil'      => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'kapasitas'       => 'nullable|string',
            'transmisi'       => 'nullable|string',
            'bahan_bakar'     => 'nullable|string',
        ]);

        $data = $request->all();
        \Log::info('Data before create:', $data);

        if ($request->hasFile('foto_mobil')) {
            $file = $request->file('foto_mobil');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/foto-mobil'), $filename);
            $data['foto_mobil'] = $filename;
            \Log::info('File uploaded:', ['filename' => $filename]);
        }

        $vehicle = Vehicle::create($data);
        \Log::info('Vehicle created:', $vehicle->toArray());

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

        $data = $request->all();

        if ($request->hasFile('foto_mobil')) {
            // Delete old photo if exists
            if ($vehicle->foto_mobil) {
                $oldPath = public_path('uploads/foto-mobil/' . $vehicle->foto_mobil);
                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }
            
            $file = $request->file('foto_mobil');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/foto-mobil'), $filename);
            $data['foto_mobil'] = $filename;
        }

        $vehicle->update($data);

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