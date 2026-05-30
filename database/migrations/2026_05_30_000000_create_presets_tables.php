<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('presets', function (Blueprint $table) {
            $table->id();
            // FK nullable a usuarios. Si se borra el usuario, se borran sus presets privados.
            $table->foreignId('id_user')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('name', 16);
            $table->boolean('fav')->default(false);
            $table->unsignedTinyInteger('cat');
            $table->unsignedInteger('crc32');
            $table->binary('params', 128); // BINARY(128) para los datos crudos del instrumento
            $table->text('desc')->nullable();
            $table->decimal('rating', 3, 2)->nullable(); // Almacena promedios como 4.75
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presets');
    }
};