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
            'total_price' => 'required|integer|min:0',
        ]);

        $vehicle = Vehicle::find($request->vehicle_id);
        
        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Kendaraan tidak ditemukan. ID kendaraan tidak valid.'
            ], 404);
        }

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

    public function uploadProof(Request $request, $rental)
    {
        $rental = Rental::find($rental);

        if (!$rental) {
            return response()->json([
                'success' => false,
                'message' => 'Data transaksi tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'bukti_pembayaran' => 'required|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        if ($request->hasFile('bukti_pembayaran')) {
            $file = $request->file('bukti_pembayaran');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/bukti-pembayaran'), $filename);
            
            $rental->update(['bukti_pembayaran' => $filename]);

            return response()->json([
                'success' => true,
                'message' => 'Bukti pembayaran berhasil diupload',
                'data'    => $rental
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal upload bukti pembayaran'
        ], 400);
    }

    public function updateStatus(Request $request, $rental)
    {
        $rental = Rental::find($rental);

        if (!$rental) {
            return response()->json([
                'success' => false,
                'message' => 'Data transaksi tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'status' => 'required|in:menunggu,disetujui,completed,cancelled',
        ]);

        $rental->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Status transaksi berhasil diperbarui',
            'data'    => $rental
        ], 200);
    }
}
