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
        $users = User::whereNotIn('email', ['admin@a.com', 'user@u.com'])->get();
        
        $presets = Preset::all()->map(function ($preset) {
            $preset->quality_bias = fake()->numberBetween(1, 5);
            return $preset;
        });

        if ($users->isEmpty() || $presets->isEmpty()) {
            return;
        }

        foreach ($users as $user) {
            foreach ($presets as $preset) {
                $vote = $preset->quality_bias + fake()->numberBetween(-1, 1);
                
                $finalVote = max(1, min(5, $vote));

                Rating::updateOrCreate(
                    [
                        'id_user'   => $user->id,
                        'id_preset' => $preset->id,
                    ],
                    [
                        'rate' => $finalVote,
                    ]
                );
            }
        }
    }
}