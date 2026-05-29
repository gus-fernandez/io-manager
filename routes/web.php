<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FirmwareController;
use App\Http\Controllers\WsTokenController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::prefix('api')->group(function () {
    Route::get('/firmware/list', [FirmwareController::class, 'index'])->name('firmware.list');
    Route::get('/firmware/{firmware}/download', [FirmwareController::class, 'download'])->name('firmware.download');
    
    // Seguridad WS
    //Route::get('/ws-token', [WsTokenController::class, 'index'])->name('ws.token');
});

Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/api/current-user', function (Request $request) {
        return response()->json($request->user());
    })->name('current-user');

    Route::prefix('api')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
});

// ── AUTENTICACIÓN (Breeze) ───────────────────────────────────────────────
require __DIR__.'/auth.php';