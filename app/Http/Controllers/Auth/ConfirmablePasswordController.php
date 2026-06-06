<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

/**
 * @group Authentication
 */
class ConfirmablePasswordController extends Controller
{
    /**
     * Confirmar contraseña
     *
     * Valida la contraseña actual del usuario antes de realizar acciones sensibles.
     *
     * @authenticated
     * * @bodyParam password string required La contraseña actual del usuario.
     *
     * @response 200 {
     * "confirmed": true,
     * "message": "Contraseña confirmada correctamente."
     * }
     *
     * @response 422 {
     * "message": "The given data was invalid.",
     * "errors": { "password": ["La contraseña es incorrecta."] }
     * }
     */
    public function store(Request $request): JsonResponse
    {
        if (! Auth::guard('web')->validate([
            'email' => $request->user()->email,
            'password' => $request->password,
        ])) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }

        // Guarda en sesión el timestamp de la confirmación
        $request->session()->put('auth.password_confirmed_at', time());

        return response()->json([
            'confirmed' => true,
            'message' => 'Contraseña confirmada correctamente.'
        ]);
    }
}