<?php

namespace App\Http\Controllers;

use App\Models\Firmware;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Illuminate\Support\Facades\Storage;

class FirmwareController extends Controller
{
    /**
     * GET /api/firmware?instrument=IO-8
     *
     * Devuelve el último stable y el último nightly del instrumento.
     * Si no se especifica instrumento, devuelve todos los instrumentos disponibles.
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
     * GET /api/firmware/{firmware}/download
     *
     * Descarga el .bin. Solo accesible para usuarios autenticados.
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