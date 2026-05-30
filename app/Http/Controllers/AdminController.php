<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    /**
     * Subir firmware
     */
    public function uploadFirmware(Request $request): JsonResponse
    {
        // 1. Validar el archivo
        $request->validate([
            'firmware' => 'required|file|mimes:bin,hex|max:10240', // 10MB máximo
        ]);

        // 2. Lógica para guardar el archivo
        $path = $request->file('firmware')->store('firmwares');

        return response()->json([
            'message' => 'Firmware subido con éxito.',
            'path' => $path
        ], 201);
    }

    /**
     * Listar usuarios del sistema
     */
    public function indexUsers(): JsonResponse
    {
        $users = \App\Models\User::all();
        
        return response()->json([
            'users' => $users
        ]);
    }
}