<?php

use App\Http\Controllers\Api\V1\VehicleController;
use App\Http\Controllers\Api\V1\RentalController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    
    Route::apiResource('vehicles', VehicleController::class);
    Route::apiResource('rentals', RentalController::class);

    
});