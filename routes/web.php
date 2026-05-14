<?php
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. Landing Page
Route::get('/', function () {
    return Inertia::render('Landing', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('landing');

// 2. Modo Local (sin auth)
Route::get('/local', fn() => Inertia::render('Dashboard'))->name('local');

// 3. Grupo IO
Route::prefix('io')->group(function () {
    Route::get('/ui', fn() => Inertia::render('IO/UI'))->name('io.ui');
    Route::get('/presets', fn() => Inertia::render('IO/Presets'))->name('io.presets');
    Route::get('/firmware', fn() => Inertia::render('IO/Firmware'))->name('io.firmware');
});

Route::get('/about', fn() => Inertia::render('About'))->name('about');

// 4. Dashboard (auth)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// 5. Perfil (auth)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';