<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Database\Factories\PresetFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Preset extends Model
{   
    use HasFactory;
    
    protected $fillable = [
        'id_user',
        'name',
        'fav',
        'cat',
        'crc32',
        'params',
        'desc',
        'rating',
    ];

    protected function casts(): array
    {
        return [
            'fav'    => 'boolean',
            'cat'    => 'integer',
            'crc32'  => 'integer',
            'rating' => 'float',
            'params' => \App\Casts\BinaryToHex::class,
        ];
    }

    // Scopes

    public function scopeGlobal(Builder $query): Builder
    {
        return $query->whereNull('id_user');
    }

    public function scopeCategory(Builder $query, int $category): Builder
    {
        return $query->where('cat', $category);
    }

    public function scopeTopRated(Builder $query): Builder
    {
        return $query->whereNotNull('rating')->orderBy('rating', 'desc');
    }

    // Relaciones

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class, 'id_preset');
    }
}