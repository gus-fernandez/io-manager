<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetLinkController extends Controller
{
    /**
     * Maneja la solicitud de envío del enlace de recuperación de contraseña.
     *
     * @throws ValidationException
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