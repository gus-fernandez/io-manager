<?php

// App/Http/Controllers/WsTokenController.php
// Not implemented yet

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

/**
 * @group Websocket
 *
 * Gestión de tokens para la comunicación en tiempo real.
 */
class WsTokenController extends Controller
{
    /**
     * Obtener token WebSocket
     *
     * Devuelve el token necesario para establecer la conexión con el servidor WebSocket.
     *
     * @response 200 {
     * "token": "tu-token-seguro-aqui"
     * }
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'token' => config('services.esp32.ws_token'),
        ]);
    }
}