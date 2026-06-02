<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FirmwareController;
use App\Http\Controllers\PresetController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\WsTokenController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// API PÚBLICA
Route::prefix('api')->group(function () {
    Route::get('/firmware/list', [FirmwareController::class, 'index'])->name('firmware.list');
    Route::get('/firmware/{firmware}/download', [FirmwareController::class, 'download'])->name('firmware.download');
    
    // Listado de presets (Público)
    Route::get('/cloud/public', [PresetController::class, 'indexPublic'])
    ->middleware('auth:sanctum') 
    ->name('cloud.public');
    
    // Seguridad WS
    //Route::get('/ws-token', [WsTokenController::class, 'index'])->name('ws.token');
});

// API PROTEGIDA (SANCTUM)
Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/api/current-user', function (Request $request) {
        return response()->json($request->user());
    })->name('current-user');

    Route::prefix('api')->group(function () {
        // Perfil
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        // Presets CRUD
        Route::get('/cloud/private', [PresetController::class, 'indexPrivate'])->name('cloud.private');
        Route::post('/presets', [PresetController::class, 'store'])->name('presets.store');
        Route::delete('/presets/{preset}', [PresetController::class, 'destroy'])->name('presets.destroy');
        Route::put('/presets/{preset}', [PresetController::class, 'update'])->name('presets.update');
        
        // Ratings (Votar)
        Route::post('/presets/{preset}/rate', [RatingController::class, 'store'])->name('presets.rate');
        Route::delete('/presets/{preset}/rate', [RatingController::class, 'destroy'])->name('presets.rate.delete');
    });
});

// RUTAS ADMIN (PROTEGIDAS)
Route::middleware(['auth:sanctum', 'admin'])->prefix('api/admin')->group(function () {
    Route::post('/firmware/upload', [AdminController::class, 'uploadFirmware']);
    Route::get('/users', [AdminController::class, 'indexUsers']);
});

require __DIR__.'/auth.php';

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');