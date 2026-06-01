<?php

namespace App\Http\Controllers;

use App\Models\Preset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PresetController extends Controller
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

    public function indexPublic(Request $request): JsonResponse
    {
        try {
            $data = \App\Models\Preset::query()->global()->orderBy('name')->get();
            return response()->json($data);
        } catch (\Exception $e) {
            \Log::error('Error en indexPublic: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno al cargar presets públicos'], 500);
        }
    }

    public function indexPrivate(Request $request): JsonResponse
    {
        try {
            if (!$request->user()) {
                return response()->json(['error' => 'No autenticado'], 401);
            }
            
            $data = \App\Models\Preset::where('id_user', $request->user()->id)->orderBy('name')->get();
            return response()->json($data);
        } catch (\Exception $e) {
            \Log::error('Error en indexPrivate: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno al cargar tus presets'], 500);
        }
    }

    /**
     * POST /api/presets
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'      => 'required|string|max:16',
            'cat'       => 'required|integer',
            'crc32'     => 'required|integer',
            'params'    => 'required|string', 
            'desc'      => 'nullable|string|max:255',
            'fav'       => 'nullable|boolean',
            'is_global' => 'nullable|boolean'
        ]);

        $user = Auth::user();
        $isGlobalRequested = $request->boolean('is_global');

        // SEGURIDAD: Solo admin puede crear presets globales
        if ($isGlobalRequested && !$user->is_admin) {
            return response()->json(['message' => 'No tienes permisos para crear presets públicos.'], 403);
        }

        $id_user = ($user->is_admin && $isGlobalRequested) ? null : $user->id;

        $preset = Preset::create([
            'id_user' => $id_user,
            'name'    => $request->name,
            'cat'     => $request->cat,
            'crc32'   => $request->crc32,
            'params'  => $request->params,
            'desc'    => $request->desc,
            'fav'     => is_null($id_user) ? false : $request->boolean('fav'),
        ]);

        return response()->json([
            'message' => 'Preset guardado con éxito',
            'preset'  => $preset
        ], 201);
    }

    public function destroy(Preset $preset): JsonResponse
    {
        $user = Auth::user();

        $isOwner = $preset->id_user === $user->id;
        $isAdminDeletingGlobal = $user->is_admin && is_null($preset->id_user);

        if (!$isOwner && !$isAdminDeletingGlobal) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $preset->delete();

        return response()->json(['message' => 'Preset eliminado.']);
    }

    /**
     * PUT /api/presets/{preset}
     */
    public function update(Request $request, Preset $preset): JsonResponse
    {
        $user = Auth::user();

        $isOwner = $preset->id_user === $user->id;
        $isAdminUpdatingGlobal = $user->is_admin && is_null($preset->id_user);

        if (!$isOwner && !$isAdminUpdatingGlobal) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $request->validate([
            'name'   => 'required|string|max:16',
            'cat'    => 'required|integer',
            'crc32'  => 'required|integer',
            'params' => 'required|string',
            'desc'   => 'nullable|string|max:255',
            'fav'    => 'nullable|boolean',
        ]);

        $id_user = $preset->id_user;

        $preset->update([
            'name'   => $request->name,
            'cat'    => $request->cat,
            'crc32'  => $request->crc32,
            'params' => $request->params,
            'desc'   => $request->desc,
            'fav'    => is_null($id_user) ? false : $request->boolean('fav'),
        ]);

        return response()->json([
            'message' => 'Preset actualizado con éxito',
            'preset'  => $preset->fresh(),
        ]);
    }
}