<?php

namespace App\Http\Controllers;

use App\Models\Preset;
use App\Models\Rating;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @group Ratings
 *
 * Gestión de puntuaciones para presets de fábrica.
 */
class RatingController extends Controller
{
    /**
     * Votar un preset
     *
     * Registra o actualiza la puntuación de un usuario en un preset de fábrica.
     *
     * @authenticated
     * @urlParam preset integer required ID del preset.
     * @bodyParam rate integer required Puntuación (entre 1 y 5).
     *
     * @response 200 {
     * "message": "Voto registrado con éxito",
     * "rating": 4.5,
     * "user_voted": true,
     * "user_vote": 5
     * }
     * @response 403 {
     * "error": "Solo se pueden votar los presets de fábrica"
     * }
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
            'user_voted' => true,
            'user_vote'  => (int) $request->rate,
        ]);
    }

    /**
     * Eliminar voto
     *
     * Elimina la puntuación del usuario actual en un preset de fábrica.
     *
     * @authenticated
     * @urlParam preset integer required ID del preset.
     *
     * @response 200 {
     * "message": "Voto eliminado",
     * "rating": 4.0,
     * "user_voted": false,
     * "user_vote": null
     * }
     */
    public function destroy(Preset $preset): JsonResponse
    {
        if ($preset->id_user !== null) {
            return response()->json(['error' => 'Solo se pueden votar presets de fábrica'], 403);
        }

        $userId = Auth::id();

        Rating::where('id_user', $userId)->where('id_preset', $preset->id)->delete();

        $avg = Rating::where('id_preset', $preset->id)->avg('rate');
        $preset->update(['rating' => round($avg ?? 0, 2)]);

        return response()->json([
            'message' => 'Voto eliminado',
            'rating'  => $preset->rating,
            'user_voted' => false,
            'user_vote'  => null,
        ]);
    }
}