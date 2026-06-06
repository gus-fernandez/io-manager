<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

/**
 * @group Authentication
 */
class VerifyEmailController extends Controller
{
    /**
     * Verificar email
     *
     * Valida el enlace de verificación enviado al correo electrónico del usuario.
     *
     * @urlParam id integer required El ID del usuario.
     * @urlParam hash string required El hash de verificación.
     *
     * @response 302 Redirige al frontend con el parámetro ?verified=1
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        // Si ya está verificado, redirige al frontend con un parámetro de éxito
        if ($request->user()->hasVerifiedEmail()) {
            return redirect('http://localhost:5174?verified=1');
        }

        // Marcamos como verificado y disparamos el evento
        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        // Redirige al frontend tras la verificación exitosa
        return redirect('http://localhost:5174?verified=1');
    }
}