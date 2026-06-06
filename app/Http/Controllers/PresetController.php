<?php

namespace App\Http\Controllers;

use App\Models\Preset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @group Presets
 *
 * APIs para la gestión, creación y almacenamiento de presets.
 */
class PresetController extends Controller
{
    
    /**
     * Listar presets (mix)
     *
     * Devuelve una lista combinada de presets globales y del usuario autenticado.
     *
     * @queryParam cat integer Filtro opcional por categoría.
     * @response 200 {
     * "global": [...],
     * "user": [...]
     * }
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
     * Listar presets públicos
     *
     * Devuelve todos los presets globales con información de votación del usuario actual si existe.
     *
     * @response 200 {
     * "id": 1, "name": "Deep Space", "user_voted": false, "user_vote": null
     * }
     */
    public function indexPublic(Request $request): JsonResponse
    {
        try {
            $userId = Auth::id(); 

            $data = \App\Models\Preset::query()
                ->global()
                ->when($userId, function ($query, $userId) {
                    $query->withExists(['ratings as user_voted' => function ($q) use ($userId) {
                        $q->where('id_user', $userId);
                    }]);
                    $query->addSelect(['user_vote' => \App\Models\Rating::select('rate')
                        ->whereColumn('id_preset', 'presets.id')
                        ->where('id_user', $userId)
                        ->limit(1)
                    ]);
                }, function ($query) {
                    $query->selectRaw('*, false as user_voted');
                })
                ->orderBy('name')
                ->get();

            return response()->json($data);
        } catch (\Exception $e) {
            \Log::error('Error en indexPublic: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno al cargar presets públicos'], 500);
        }
    }

    /**
     * Listar presets privados
     *
     * Devuelve solo los presets creados por el usuario autenticado.
     *
     * @authenticated
     * @response 200 {
     * "id": 1, "name": "My Sound", "id_user": 1
     * }
     */
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
     * Guardar preset
     *
     * Crea un nuevo preset. Solo los administradores pueden crear presets globales (is_global=true).
     *
     * @authenticated
     * @bodyParam name string required Nombre (máx 16 caracteres).
     * @bodyParam cat integer required ID de categoría.
     * @bodyParam crc32 integer required CRC32 del preset para integridad.
     * @bodyParam params string required Datos crudos del preset.
     * @bodyParam desc string optional Descripción.
     * @bodyParam fav boolean optional Marcar como favorito.
     * @bodyParam is_global boolean optional Si es global (solo admin).
     *
     * @response 201 {
     * "message": "Preset guardado con éxito",
     * "preset": {...}
     * }
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

    /**
     * Eliminar preset
     *
     * Elimina un preset. Solo el dueño o un administrador pueden realizar esta acción.
     *
     * @authenticated
     * @urlParam preset integer required ID del preset a eliminar.
     */
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
     * Actualizar preset
     *
     * Modifica un preset existente. Requiere ser el dueño o administrador.
     *
     * @authenticated
     * @urlParam preset integer required ID del preset.
     * @bodyParam name string required Nombre (máx 16 caracteres).
     * @bodyParam cat integer required ID de categoría.
     * @bodyParam crc32 integer required CRC32.
     * @bodyParam params string required Datos del preset.
     * @bodyParam desc string optional Descripción.
     * @bodyParam fav boolean optional Marcar como favorito.
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