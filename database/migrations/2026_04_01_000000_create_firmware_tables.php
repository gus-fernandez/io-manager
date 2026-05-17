<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('firmwares', function (Blueprint $table) {
            $table->id();
            $table->string('instrument');           // IO-8, IO-B3, IO-808...
            $table->string('compatibility');        // ESP32-WROOM-32 (relación futura)
            $table->string('version');              // 0.6.0
            $table->string('filename');             // IO-8_v0.6.0.bin
            $table->text('description')->nullable();
            $table->enum('channel', ['stable', 'nightly'])->default('stable');
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->timestamps();

            // Evita duplicados: mismo instrumento + versión + canal
            $table->unique(['instrument', 'version', 'channel']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('firmwares');
    }
};