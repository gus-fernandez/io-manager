<?php

namespace Database\Seeders;

use App\Models\Preset;
use Illuminate\Database\Seeder;

class PresetSeeder extends Seeder
{
    public function run(): void
    {
        $presets = [
            [
                'id_user' => null, // Null significa que es del repositorio general (fábrica)
                'name'    => 'Init Patch',
                'fav'     => false,
                'cat'     => 0,    // 0: Undef
                'crc32'   => 4294967295,
                'params'  => hex2bin(str_repeat('00', 128)), // 128 bytes de ceros
                'desc'    => 'Preset por defecto completamente limpio.',
            ],
            [
                'id_user' => null,
                'name'    => 'Fat Bass O8',
                'fav'     => false,
                'cat'     => 4,    // 4: Bass
                'crc32'   => 1234567890,
                'params'  => hex2bin(str_repeat('aa', 128)), // 128 bytes dummy
                'desc'    => 'Bajo analógico gordo ideal para líneas de sintetizador ochenteras.',
            ],
            [
                'id_user' => null,
                'name'    => 'Cyber Lead',
                'fav'     => false,
                'cat'     => 1,    // 1: Lead
                'crc32'   => 2718281828,
                'params'  => hex2bin(str_repeat('ff', 128)), // 128 bytes dummy
                'desc'    => 'Sonido solista agresivo con mucho brillo para pasajes rápidos.',
            ],
            [
                'id_user' => null,
                'name'    => 'Cosmic Pad',
                'fav'     => false,
                'cat'     => 2,    // 2: Pad
                'crc32'   => 3141592653,
                'params'  => hex2bin(str_repeat('55', 128)), // 128 bytes dummy
                'desc'    => 'Atmósfera espacial profunda con evolución lenta.',
            ],
        ];

        foreach ($presets as $data) {
            // Evitamos duplicados basándonos en el nombre y su checksum CRC32
            Preset::firstOrCreate(
                [
                    'name'  => $data['name'],
                    'crc32' => $data['crc32'],
                ],
                [
                    'id_user' => $data['id_user'],
                    'fav'     => $data['fav'],
                    'cat'     => $data['cat'],
                    'params'  => $data['params'],
                    'desc'    => $data['desc'],
                    'rating'  => null, // Se inicializa en null, cambia cuando los usuarios voten
                ]
            );
        }
        
        if (app()->environment('local')) {
            Preset::factory()->count(20)->create();
        }
    }
    
}