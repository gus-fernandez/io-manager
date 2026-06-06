<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

/**
 * @group Authentication
 */
class PasswordController extends Controller
{
    /**
     * Actualizar contraseña
     *
     * Permite al usuario autenticado cambiar su contraseña actual.
     *
     * @authenticated
     * @bodyParam current_password string required La contraseña actual del usuario.
     * @bodyParam password string required La nueva contraseña (mínimo 8 caracteres, complejidad según configuración).
     * @bodyParam password_confirmation string required La confirmación de la nueva contraseña.
     *
     * @response 200 {
     * "message": "Contraseña actualizada correctamente."
     * }
     * @response 422 {
     * "message": "The given data was invalid.",
     * "errors": { "current_password": ["La contraseña actual es incorrecta."] }
     * }
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Devolvemos una respuesta limpia en JSON para tu React
        return response()->json([
            'message' => 'Contraseña actualizada correctamente.'
        ]);
    }
}