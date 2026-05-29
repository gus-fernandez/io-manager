<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
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