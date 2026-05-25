<?php

namespace Database\Seeders;

use App\Models\Firmware;
use Illuminate\Database\Seeder;

class FirmwareSeeder extends Seeder
{
    public function run(): void
    {
        $firmwares = [
            [
                'instrument'    => 'IO-8',
                'version'       => '0.6.0',
                'channel'       => 'stable',
                'compatibility' => 'ESP32-WROOM-32',
                'filename'      => 'IO-8_v0.6.0.bin',
                'description'   => 'Alpha test',
            ],
            [
                'instrument'    => 'IO-8',
                'version'       => '0.6.1',
                'channel'       => 'nightly',
                'compatibility' => 'ESP32-WROOM-32',
                'filename'      => 'IO-8_v0.6.1.bin',
                'description'   => 'Alpha: WiFi, OTA & Webshockets implemented',
            ],
            [
                'instrument'    => 'IO-8',
                'version'       => '0.6.2',
                'channel'       => 'stable',
                'compatibility' => 'ESP32-WROOM-32',
                'filename'      => 'IO-8_v0.6.2.bin',
                'description'   => 'Alpha: mDNS, WS stable',
            ],
            [
                'instrument'    => 'IO-8',
                'version'       => '0.6.3',
                'channel'       => 'nightly',
                'compatibility' => 'ESP32-WROOM-32',
                'filename'      => 'IO-8_v0.6.3.bin',
                'description'   => 'Alpha: Preset System Impl.',
            ],
            [
                'instrument'    => 'IO-8',
                'version'       => '0.7.0',
                'channel'       => 'stable',
                'compatibility' => 'ESP32-WROOM-32',
                'filename'      => 'IO-8_v0.7.0.bin',
                'description'   => 'Alpha: Complete Preset System',
            ],
        ];

        foreach ($firmwares as $data) {
            $path = storage_path('app/private/firmware/' . $data['filename']);
            $size = file_exists($path) ? filesize($path) : null;

            Firmware::firstOrCreate(
                [
                    'instrument' => $data['instrument'],
                    'version'    => $data['version'],
                    'channel'    => $data['channel'],
                ],
                [
                    'compatibility' => $data['compatibility'],
                    'filename'      => $data['filename'],
                    'description'   => $data['description'],
                    'size_bytes'    => $size,
                ]
            );
        }
    }
}