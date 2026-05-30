<?php

// app/Http/Controllers/WsTokenController.php
// Not implemented yet

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class WsTokenController extends Controller
{
    /**
     * GET /api/ws-token
     * Devuelve el token WebSocket para usuarios autenticados
     * o para modo local (sin auth).
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'token' => config('services.esp32.ws_token'),
        ]);
    }
}