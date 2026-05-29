<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class NewPasswordController extends Controller
{
    /**
     * Procesa la solicitud de la nueva contraseña.
     *
     * @throws ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Intentamos restablecer la contraseña del usuario
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        // Si es correcto, devolvemos JSON en lugar de redirigir a la vista de login
        if ($status == Password::PASSWORD_RESET) {
            return response()->json([
                'status' => __($status),
                'message' => 'Tu contraseña ha sido restablecida correctamente.'
            ]);
        }

        // Si falla, la excepción ValidationException devolverá automáticamente un error 422 en JSON
        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
}