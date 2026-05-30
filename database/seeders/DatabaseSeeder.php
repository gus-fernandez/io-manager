<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name'     => 'Admin User',
            'email'    => 'admin@a.com',
            'password' => Hash::make('12345678'),
            'is_admin' => true,
        ]);

        // Usuario Normal Fijo
        User::factory()->create([
            'name'     => 'Regular User',
            'email'    => 'user@u.com',
            'password' => Hash::make('12345678'),
        ]);

        // Creamos 10 usuarios adicionales para simular la comunidad
        User::factory(20)->create();

        $this->call([
            FirmwareSeeder::class,
            PresetSeeder::class,
            RatingSeeder::class, 
        ]);
    }
}