<?php

namespace Database\Seeders;

use App\Models\Firmware;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class FirmwareSeeder extends Seeder
{
    public function run(): void
    {
        $filename = 'IO-8_v0.6.0.bin';
        $path     = storage_path('app/private/firmware/' . $filename);
        $size     = file_exists($path) ? filesize($path) : null;

        Firmware::firstOrCreate(
            [
                'instrument' => 'IO-8',
                'version'    => '0.6.0',
                'channel'    => 'stable',
            ],
            [
                'compatibility' => 'ESP32-WROOM-32',
                'filename'      => $filename,
                'description'   => 'Alpha test',
                'size_bytes'    => $size,
            ]
        );
    }
}