<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * @group Administration
 *
 * APIs para la gestión administrativa del sistema (requiere privilegios).
 */
class AdminController extends Controller
{
    /**
     * Subir firmware
     *
     * Sube un archivo binario de firmware y registra sus metadatos en la base de datos.
     *
     * @authenticated
     * @bodyParam firmware file required El archivo binario (.bin) del firmware (máx 10MB).
     * @bodyParam instrument string required Nombre del instrumento.
     * @bodyParam version string required Versión del firmware (ej. 1.0.0).
     * @bodyParam channel string required Canal de despliegue: "stable" o "nightly".
     * @bodyParam description string optional Descripción del firmware.
     *
     * @response 201 {
     * "message": "Firmware subido y registrado con éxito.",
     * "firmware": { "id": 1, "instrument": "IO-8", "version": "1.0.0", "channel": "stable", "size_bytes": 1024 }
     * }
     */
    public function uploadFirmware(Request $request): JsonResponse
    {
        $request->validate([
            'firmware'    => 'required|file|max:10240',
            'instrument'  => 'required|string',
            'version'     => 'required|string',
            'channel'     => 'required|in:stable,nightly',
            'description' => 'nullable|string',
        ]);

        $file = $request->file('firmware');
        $version = $request->input('version');
        $filename = "IO-8_v{$version}.bin";
        $file->storeAs('firmware', $filename);

        $firmware = \App\Models\Firmware::create([
            'instrument'    => 'IO-8',
            'compatibility' => 'ESP32-WROOM-32',
            'version'       => $version,
            'filename'      => $filename,
            'description'   => $request->input('description'),
            'channel'       => $request->input('channel'),
            'size_bytes'    => $file->getSize(),
        ]);

        return response()->json([
            'message'  => 'Firmware subido y registrado con éxito.',
            'firmware' => $firmware
        ], 201);
    }

    /**
     * Listar usuarios
     *
     * Obtiene una lista completa de todos los usuarios registrados en el sistema.
     *
     * @authenticated
     * @response 200 {
     * "users": [ { "id": 1, "name": "Admin", "email": "admin@io.com", "created_at": "2026-06-06T..." } ]
     * }
     */
    public function indexUsers(): JsonResponse
    {
        $users = \App\Models\User::all();
        
        return response()->json([
            'users' => $users
        ]);
    }
}