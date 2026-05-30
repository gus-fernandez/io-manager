<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PresetFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id_user' => null, // Por defecto creamos globales
            'name'    => mb_substr(fake()->words(2, true), 0, 15),
            'fav'     => false,
            'cat'     => fake()->numberBetween(0, 7),
            'crc32'   => fake()->numberBetween(1000000000, 4000000000),
            'params'  => hex2bin(str_repeat('ff', 128)), // Dummy data
            'desc'    => mb_substr(fake()->sentence(), 0, 200),
        ];
    }
}