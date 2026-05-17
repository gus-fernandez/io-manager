<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Firmware extends Model
{
    protected $table = 'firmwares';

    protected $fillable = [
        'instrument',
        'compatibility',
        'version',
        'filename',
        'description',
        'channel',
        'size_bytes',
    ];

    protected $casts = [
        'size_bytes' => 'integer',
    ];

    // ── Scopes ────────────────────────────────────────────────────────────────

    public function scopeInstrument(Builder $query, string $instrument): Builder
    {
        return $query->where('instrument', $instrument);
    }

    public function scopeChannel(Builder $query, string $channel): Builder
    {
        return $query->where('channel', $channel);
    }

    public function scopeLatest(Builder $query): Builder
    {
        // Ordena por versión semántica correctamente (no alfabético)
        return $query->orderByRaw("INET_ATON(CONCAT(version, '.0'))  DESC")
                     ->orOrderBy('created_at', 'desc');
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Devuelve el firmware más reciente de un instrumento y canal.
     */
    public static function latestFirmware(string $instrument, string $channel): ?self
    {
        return static::where('instrument', $instrument)
            ->where('channel', $channel)
            ->orderByRaw("INET_ATON(CONCAT(version, '.0')) DESC")
            ->first();
    }

    /**
     * Ruta absoluta al archivo en storage.
     */
    public function storagePath(): string
    {
        return storage_path('app/private/firmware/' . $this->filename);
    }

    /**
     * Tamaño legible (ej: "1.2 MB").
     */
    public function readableSize(): string
    {
        if (!$this->size_bytes) return 'Desconocido';
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = floor(log($this->size_bytes, 1024));
        return round($this->size_bytes / pow(1024, $i), 2) . ' ' . $units[$i];
    }
}