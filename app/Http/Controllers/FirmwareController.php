<?php

namespace App\Http\Controllers;

use App\Models\Firmware;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Illuminate\Support\Facades\Storage;

/**
 * @group Firmware
 *
 * Gestión y descarga de archivos de firmware para los instrumentos.
 */
class FirmwareController extends Controller
{
    /**
     * Listar firmware
     *
     * Devuelve el último firmware estable y nightly para un instrumento específico.
     * Si no se proporciona el parámetro 'instrument', devuelve la lista de instrumentos disponibles.
     *
     * @queryParam instrument string El nombre del instrumento (ej. IO-8).
     *
     * @response 200 {
     * "instrument": "IO-8",
     * "firmware": {
     * "stable": { "id": 1, "version": "1.0.0", "description": "Lanzamiento estable", "size": "1.2 MB", "created_at": "2026-06-06" },
     * "nightly": { "id": 2, "version": "1.1.0-beta", "description": "Versión en pruebas", "size": "1.2 MB", "created_at": "2026-06-07" }
     * }
     * }
     * @response 200 {
     * "instruments": ["IO-8", "IO-12"]
     * }
     */
    public function index(): JsonResponse
    {
        $instrument = request('instrument');

        if (!$instrument) {
            // Lista de instrumentos disponibles (para poblar un selector en el futuro)
            $instruments = Firmware::select('instrument')
                ->distinct()
                ->orderBy('instrument')
                ->pluck('instrument');

            return response()->json(['instruments' => $instruments]);
        }

        $channels = ['stable', 'nightly'];
        $result   = [];

        foreach ($channels as $channel) {
            $fw = Firmware::latestFirmware($instrument, $channel);
            if ($fw) {
                $result[$channel] = [
                    'id'            => $fw->id,
                    'version'       => $fw->version,
                    'description'   => $fw->description,
                    'compatibility' => $fw->compatibility,
                    'size'          => $fw->readableSize(),
                    'created_at'    => $fw->created_at->toDateString(),
                ];
            }
        }

        return response()->json([
            'instrument' => $instrument,
            'firmware'   => $result,
        ]);
    }

    /**
     * Descargar firmware
     *
     * Inicia la descarga del archivo binario (.bin) asociado a un firmware específico.
     *
     * @urlParam firmware integer required El ID del registro de firmware.
     *
     * @response 200 { "binary": "file content" }
     * @response 404 { "message": "Archivo no encontrado" }
     */
    public function download(Firmware $firmware): BinaryFileResponse
    {
        $path = $firmware->storagePath();

        abort_unless(file_exists($path), 404, 'Archivo no encontrado');

        return response()->download(
            $path,
            $firmware->filename,
            ['Content-Type' => 'application/octet-stream']
        );
    }
}