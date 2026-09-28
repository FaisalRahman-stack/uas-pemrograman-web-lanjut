<?php

use App\Http\Controllers\Api\V1\VehicleController;
use App\Http\Controllers\Api\V1\RentalController;
use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Support\Facades\Route;

$defineRoutes = function () {
    // Endpoint publik
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::get('/vehicles/{id}', [VehicleController::class, 'show']);

    // Endpoint protected
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::apiResource('rentals', RentalController::class);

        Route::post('/vehicles', [VehicleController::class, 'store']);
        Route::post('/vehicles/{id}', [VehicleController::class, 'update']);
        Route::delete('/vehicles/{id}', [VehicleController::class, 'destroy']);

        Route::post('/rentals/{rental}/upload-proof', [RentalController::class, 'uploadProof']);
        Route::patch('/rentals/{rental}/update-status', [RentalController::class, 'updateStatus']);
        Route::delete('/rentals/{rental}', [RentalController::class, 'destroy']);
    });
};

// Rute langsung (menangani request saat path /api atau /v1 terpotong oleh router Vercel)
$defineRoutes();

// Rute dengan prefix v1 (menangani request utuh /v1/...)
Route::prefix('v1')->group($defineRoutes);