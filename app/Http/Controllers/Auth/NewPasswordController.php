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

/**
 * @group Authentication
 */
class NewPasswordController extends Controller
{
    /**
     * Redirección para restablecer contraseña
     *
     * Redirige al usuario al formulario de restablecimiento en el frontend con el token.
     *
     * @queryParam token string required El token de restablecimiento.
     * @queryParam email string optional El email del usuario.
     */
    public function create(Request $request, string $token): \Illuminate\Http\RedirectResponse
    {
        return redirect(
            env('FRONTEND_URL') . '/reset-password?token=' . $token . '&email=' . urlencode($request->query('email', ''))
        );
    }

    /**
     * Restablecer contraseña
     *
     * Procesa el cambio de contraseña utilizando el token enviado al correo.
     *
     * @bodyParam token string required El token recibido en el email.
     * @bodyParam email string required El email del usuario.
     * @bodyParam password string required La nueva contraseña (min: 8 caracteres).
     * @bodyParam password_confirmation string required La confirmación de la contraseña.
     *
     * @response 200 {
     * "status": "passwords.reset",
     * "message": "Tu contraseña ha sido restablecida correctamente."
     * }
     * @response 422 {
     * "message": "The given data was invalid.",
     * "errors": { "email": ["El token de restablecimiento no es válido."] }
     * }
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