<?php

namespace App\Http\Controllers;

use App\Models\Preset;
use App\Models\Rating;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RatingController extends Controller
{
    /**
     * POST /api/presets/{preset}/rate
     */
    public function store(Request $request, Preset $preset): JsonResponse
    {
        $request->validate([
            'rate' => 'required|integer|between:1,5',
        ]);

        // Si tiene id_user, no es un preset de fábrica
        if ($preset->id_user !== null) {
            return response()->json(['error' => 'Solo se pueden votar los presets de fábrica'], 403);
        }

        $userId = Auth::id();

        // Guarda o actualiza el voto del usuario
        Rating::updateOrCreate(
            [
                'id_user'   => $userId,
                'id_preset' => $preset->id,
            ],
            [
                'rate' => $request->rate,
            ]
        );

        // Recalcular la media aritmética en el preset
        $avg = Rating::where('id_preset', $preset->id)->avg('rate');
        $preset->update(['rating' => round($avg, 2)]);

        return response()->json([
            'message' => 'Voto registrado con éxito',
            'rating'  => $preset->rating,
        ]);
    }
}