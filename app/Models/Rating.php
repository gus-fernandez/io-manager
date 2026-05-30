<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rating extends Model
{
    protected $fillable = [
        'id_user',
        'id_preset',
        'rate',
    ];

    protected function casts(): array
    {
        return [
            'id_user'   => 'integer',
            'id_preset' => 'integer',
            'rate'      => 'integer',
        ];
    }

    protected static function booted()
    {
        static::saved(function ($rating) {
            $rating->updatePresetRating();
        });

        static::deleted(function ($rating) {
            $rating->updatePresetRating();
        });
    }

    public function updatePresetRating()
    {
        $preset = $this->preset;
        if ($preset) {
            $preset->rating = $preset->ratings()->avg('rate');
            $preset->save();
        }
    }

    // Relaciones

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function preset(): BelongsTo
    {
        return $this->belongsTo(Preset::class, 'id_preset');
    }
}