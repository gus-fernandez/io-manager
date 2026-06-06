<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

/**
 * @group Authentication
 */
class PasswordResetLinkController extends Controller
{
    /**
     * Enviar enlace de recuperación
     *
     * Envía un enlace de restablecimiento de contraseña al correo electrónico del usuario si existe en el sistema.
     *
     * @bodyParam email string required El correo electrónico asociado a la cuenta.
     *
     * @response 200 {
     * "status": "passwords.sent",
     * "message": "Se ha enviado el enlace de restablecimiento de contraseña a tu correo electrónico."
     * }
     * @response 422 {
     * "message": "The given data was invalid.",
     * "errors": { "email": ["No podemos encontrar un usuario con esa dirección de correo."] }
     * }
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Intentamos enviar el enlace de recuperación al correo indicado
        $status = Password::sendResetLink(
            $request->only('email')
        );

        // Si se envió correctamente, devolvemos una respuesta JSON de éxito
        if ($status == Password::RESET_LINK_SENT) {
            return response()->json([
                'status' => __($status),
                'message' => 'Se ha enviado el enlace de restablecimiento de contraseña a tu correo electrónico.'
            ]);
        }

        // Si el correo no existe o falla, la excepción generará automáticamente un error 422 en JSON
        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
}