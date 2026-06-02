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
                'id_user' => null, // Public Repository
                'name'    => 'CHARIOTS OF FIRE',
                'fav'     => false,
                'cat'     => 1,
                'crc32'   => 3697429722,
                'params'  => '494fff2843484152494f5453204f4620464952450000000000001924085d2900007f004041193e3f4200000040416e434142000000407f003d3d417f00000049137f001239007f07007d1c051b7f5b0000000000000013211400000000007f540e545d00200000000f00000000000000000000000000000000000000dc624cda',
                'desc'    => 'Classic analog saw with some VCF ADSR.',
            ],
            [
                'id_user' => null,
                'name'    => 'RENDEZ VOUS I',
                'fav'     => false,
                'cat'     => 1,
                'crc32'   => 1634488702,
                'params'  => '494fff2852454e44455a20564f5553204900000000176e070a0f004100002a00000000406e3d293f3f000000406e4041414200000040700032414200000000007f3600007f004000007f1300000000000000000000004b2b2300276413015448176f6b002600000000000000000000000000000000000000001a4242616c517e',
                'desc'    => 'Simple analog saw lead for this classic song.',
            ],
            [
                'id_user' => null,
                'name'    => 'RENDEZ VOUS II',
                'fav'     => false,
                'cat'     => 1,
                'crc32'   => 1038810574,
                'params'  => '494fff2852454e44455a20564f55532049490000003f7f0008000000000000000000005f5a303e323d7f007f5f6e572741460000005f7f00163e400000000000532200007f003f00202516002c5d240000000000000057444759562d1a431e0d12634b001e00000000000000000000000000000000000000000000003deafdce',
                'desc'    => 'Hardsynced analog style for the laser part.',
            ],
            [
                'id_user' => null,
                'name'    => 'IN THE AIR',
                'fav'     => false,
                'cat'     => 3,
                'crc32'   => 2859111347,
                'params'  => '494fff68494e205448452041495200000000000000167309117f000000000000000000005e38573e3e000000006a4d42424200000000220028423e00000000005200000d241a7f0731231b00000000000000120000007c22266c114a3f007f2900546600000000000000000000000000470000000000000000110000aa6a93b3',
                'desc'    => 'Mellow digital organ with a bit of attack.',
            ],
        ];

        foreach ($presets as $data) {
            // Evitamos duplicados basándonos en el nombre y su CRC32
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