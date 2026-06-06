<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @group Authentication
 * * APIs para gestionar la sesión del usuario.
 */
class AuthenticatedSessionController extends Controller
{
    /**
     * Iniciar sesión
     *
     * Autentica al usuario mediante credenciales y genera una sesión.
     *
     * @response 200 {
     * "user": { "id": 1, "name": "Admin", "email": "admin@io.com" },
     * "message": "Login correcto."
     * }
     * @response 422 {
     * "message": "The given data was invalid.",
     * "errors": { "email": ["Las credenciales son incorrectas."] }
     * }
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Devolvemos los datos del usuario en JSON para que React cambie de pestaña
        return response()->json([
            'user' => $request->user(),
            'message' => 'Login correcto.',
        ]);
    }

    /**
     * Cerrar sesión
     *
     * Invalida la sesión actual del usuario.
     *
     * @authenticated
     * @response 200 {
     * "message": "Sesión cerrada correctamente."
     * }
     */
    public function destroy(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Sesión cerrada correctamente.',
        ]);
    }
}