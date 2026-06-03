<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
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