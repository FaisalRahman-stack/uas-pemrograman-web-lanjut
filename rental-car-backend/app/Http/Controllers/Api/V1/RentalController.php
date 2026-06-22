<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Rental;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class RentalController extends Controller
{
    public function index()
    {
        $rentals = Rental::with(['user', 'vehicle'])->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar transaksi rental berhasil diambil',
            'data'    => $rentals
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id'     => 'required|exists:users,id',
            'vehicle_id'  => 'required|exists:vehicles,id',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
            'total_price' => 'required|integer',
        ]);

        $vehicle = Vehicle::find($request->vehicle_id);
        if ($vehicle->status !== 'available') {
            return response()->json([
                'success' => false,
                'message' => 'Maaf, kendaraan ini sedang tidak tersedia untuk disewa'
            ], 400);
        }

        $rental = Rental::create($request->all());

        $vehicle->update(['status' => 'rented']);

        return response()->json([
            'success' => true,
            'message' => 'Transaksi rental berhasil dibuat',
            'data'    => $rental
        ], 201);
    }

    public function show($id)
    {
        $rental = Rental::with(['user', 'vehicle'])->find($id);

        if (!$rental) {
            return response()->json([
                'success' => false,
                'message' => 'Data transaksi tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail transaksi ditemukan',
            'data'    => $rental
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $rental = Rental::find($id);

        if (!$rental) {
            return response()->json([
                'success' => false,
                'message' => 'Data transaksi tidak ditemukan'
            ], 404);
        }

        $rental->update($request->only('status'));

        if (in_array($request->status, ['completed', 'cancelled'])) {
            Vehicle::where('id', $rental->vehicle_id)->update(['status' => 'available']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Status transaksi berhasil diperbarui',
            'data'    => $rental
        ], 200);
    }
}