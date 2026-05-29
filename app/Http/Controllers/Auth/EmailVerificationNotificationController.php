<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Enviar una nueva notificación de verificación de email.
     */
    public function store(Request $request): JsonResponse
    {
        // Si el usuario ya verificó su cuenta, avisamos al frontend
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'verified' => true,
                'message' => 'El email ya ha sido verificado.'
            ]);
        }

        // Enviar el correo de verificación estándar de Laravel
        $request->user()->sendEmailVerificationNotification();

        return response()->json([
            'status' => 'verification-link-sent',
            'message' => 'Se ha enviado un nuevo enlace de verificación a tu correo.'
        ]);
    }
}