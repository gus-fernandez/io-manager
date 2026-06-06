<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @group Profile
 *
 * Gestión del perfil de usuario autenticado.
 */
class ProfileController extends Controller
{
    /**
     * Obtener perfil
     *
     * Devuelve los datos del usuario autenticado.
     *
     * @authenticated
     * @response 200 {
     * "user": { "id": 1, "name": "Usuario", "email": "user@io.com" },
     * "mustVerifyEmail": false
     * }
     */
    public function edit(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
            'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
        ]);
    }

    /**
     * Actualizar perfil
     *
     * Actualiza la información del perfil del usuario.
     *
     * @authenticated
     * @bodyParam name string required Nombre del usuario.
     * @bodyParam email string required Correo electrónico.
     * * @response 200 {
     * "message": "Perfil actualizado correctamente"
     * }
     * @response 422 {
     * "message": "The given data was invalid.",
     * "errors": { "email": ["El correo ya ha sido tomado."] }
     * }
     */
    public function update(ProfileUpdateRequest $request): JsonResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return response()->json(['message' => 'Perfil actualizado correctamente']);
    }

    /**
     * Eliminar cuenta
     *
     * Elimina permanentemente la cuenta del usuario autenticado. Requiere confirmar la contraseña actual.
     *
     * @authenticated
     * @bodyParam password string required Contraseña actual del usuario para confirmar la eliminación.
     *
     * @response 200 {
     * "message": "Cuenta eliminada"
     * }
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();
        
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        $user->delete();

        return response()->json(['message' => 'Cuenta eliminada']);
    }
}