<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Preset;
use App\Models\Rating;
use Illuminate\Database\Seeder;

class RatingSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        // Filtramos solo los globales (públicos)
        $presets = Preset::whereNull('id_user')->get();

        if ($users->isEmpty() || $presets->isEmpty()) {
            return;
        }

        foreach ($users as $user) {
            foreach ($presets as $preset) {
                Rating::updateOrCreate(
                    [
                        'id_user'   => $user->id,
                        'id_preset' => $preset->id,
                    ],
                    [
                        'rate' => fake()->numberBetween(1, 5),
                    ]
                );
            }
        }
    }
}