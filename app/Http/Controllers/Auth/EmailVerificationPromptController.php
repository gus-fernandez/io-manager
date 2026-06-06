<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationPromptController extends Controller
{
    /**
     * Comprobar estado de verificación
     *
     * Verifica si el usuario actual tiene su cuenta de correo confirmada.
     *
     * @authenticated
     * @response 200 {
     * "verified": true,
     * "message": "El email ya está verificado."
     * }
     * @response 200 {
     * "verified": false,
     * "status": null,
     * "message": "Se requiere verificación de email."
     * }
     */
    public function __invoke(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'verified' => true,
                'message' => 'El email ya está verificado.'
            ]);
        }

        return response()->json([
            'verified' => false,
            'status' => session('status'),
            'message' => 'Se requiere verificación de email.'
        ]);
    }
}