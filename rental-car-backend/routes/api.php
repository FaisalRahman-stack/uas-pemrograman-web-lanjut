<?php

use App\Http\Controllers\Api\V1\VehicleController;
use App\Http\Controllers\Api\V1\RentalController;
use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    
    //endpoint public. bisa diakses tanpa login
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    
    //list kendaraan public agar customer bisa lihat
    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::get('/vehicles/{id}', [VehicleController::class, 'show']);

    //endpoint protected, harus login untuk mengakses
    Route::middleware('auth:sanctum')->group(function () {
        
        // Fitur Logout
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        
        Route::apiResource('rentals', RentalController::class);
        
        // Fitur modifikasi data kendaraan (Hanya boleh diakses admin/user yang login)
        Route::post('/vehicles', [VehicleController::class, 'store']);
        // Menggunakan POST untuk update agar bisa handle file upload (multipart/form-data)
        Route::post('/vehicles/{id}', [VehicleController::class, 'update']);
        Route::delete('/vehicles/{id}', [VehicleController::class, 'destroy']);

        // Fitur upload bukti bayar dan update status
        Route::post('/rentals/{rental}/upload-proof', [RentalController::class, 'uploadProof']);
        Route::patch('/rentals/{rental}/update-status', [RentalController::class, 'updateStatus']);
        Route::delete('/rentals/{rental}', [RentalController::class, 'destroy']);
        
    });


    
});