<?php

namespace App\Http\Controllers;

use App\Models\Preset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PresetsController extends Controller
{
    /**
     * GET /api/presets
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = Preset::query()->global();

        if ($request->has('cat')) {
            $query->category((int) $request->cat);
        }

        $globalPresets = $query->orderBy('name')->get();
        $userPresets = [];

        if ($user) {
            $userQuery = Preset::where('id_user', $user->id);
            if ($request->has('cat')) {
                $userQuery->category((int) $request->cat);
            }
            $userPresets = $userQuery->orderBy('name')->get();
        }

        return response()->json([
            'global' => $globalPresets,
            'user'   => $userPresets,
        ]);
    }

    /**
     * POST /api/presets
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'      => 'required|string|max:50',
            'cat'       => 'required|integer',
            'crc32'     => 'required|integer',
            'params'    => 'required|string', 
            'desc'      => 'nullable|string|max:255',
            'is_global' => 'nullable|boolean'
        ]);

        $user = Auth::user();
        $isGlobalRequested = $request->boolean('is_global');

        // SEGURIDAD: Solo admin puede crear presets globales
        if ($isGlobalRequested && !$user->is_admin) {
            return response()->json(['message' => 'No tienes permisos para crear presets públicos.'], 403);
        }

        $idUser = ($user->is_admin && $isGlobalRequested) ? null : $user->id;

        $binaryParams = ctype_xdigit($request->params) ? hex2bin($request->params) : $request->params;

        $preset = Preset::create([
            'id_user' => $idUser,
            'name'    => $request->name,
            'cat'     => $request->cat,
            'crc32'   => $request->crc32,
            'params'  => $binaryParams,
            'desc'    => $request->desc,
            'fav'     => false,
        ]);

        return response()->json([
            'message' => 'Preset guardado con éxito',
            'preset'  => $preset
        ], 201);
    }
}