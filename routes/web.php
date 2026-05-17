<?php
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\FirmwareController;

// 1. Landing Page
Route::get('/', function () {
    return Inertia::render('Landing', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('landing');

// 2. Modo Local (sin auth)
Route::get('/local', fn() => Inertia::render('IO/Control'))->name('local');

// 3. Grupo IO (público)
Route::prefix('io')->group(function () {
    Route::get('/control', fn() => Inertia::render('IO/Control'))->name('io.control');
    Route::get('/presets', fn() => Inertia::render('IO/Presets'))->name('io.presets');
    Route::get('/firmware', fn() => Inertia::render('IO/Firmware'))->name('io.firmware');
    Route::get('/about', fn() => Inertia::render('About'))->name('about');
});

// API firmware (pública)
Route::get('/api/firmware/list', [FirmwareController::class, 'index'])->name('firmware.list');
Route::get('/api/firmware/{firmware}/download', [FirmwareController::class, 'download'])->name('firmware.download');

// 4. Perfil (auth)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';