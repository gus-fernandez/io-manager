<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Solo dejamos pasar si el usuario está logueado Y es admin
        if ($request->user() && $request->user()->is_admin) {
            return $next($request);
        }

        // Si no, error 403 (Prohibido)
        return response()->json(['error' => 'No tienes permisos de administrador.'], 403);
    }
}