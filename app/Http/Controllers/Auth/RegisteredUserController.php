<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

/**
 * @group Authentication
 */
class RegisteredUserController extends Controller
{
    /**
     * Registrar usuario
     *
     * Crea un nuevo usuario en el sistema e inicia sesión automáticamente.
     *
     * @bodyParam name string required El nombre del usuario.
     * @bodyParam email string required El correo electrónico.
     * @bodyParam password string required La contraseña (mínimo 8 caracteres).
     * @bodyParam password_confirmation string required La confirmación de la contraseña.
     *
     * @response 200 {
     * "user": { "id": 1, "name": "Nombre", "email": "email@ejemplo.com" },
     * "message": "Usuario registrado e inicio de sesión correcto."
     * }
     * @response 422 {
     * "message": "The given data was invalid.",
     * "errors": { "email": ["El correo electrónico ya ha sido registrado."] }
     * }
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        // Laravel inicia la sesión automáticamente tras registrarse
        Auth::login($user);

        // Devolvemos el usuario y confirmamos el éxito en JSON
        return response()->json([
            'user' => $user,
            'message' => 'Usuario registrado e inicio de sesión correcto.',
        ]);
    }
}