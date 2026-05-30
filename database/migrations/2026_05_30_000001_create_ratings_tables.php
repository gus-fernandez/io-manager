<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user')->constrained('users')->onDelete('cascade');
            $table->foreignId('id_preset')->constrained('presets')->onDelete('cascade');
            $table->unsignedTinyInteger('rate'); // Puntuación (ej. 1 a 5)
            $table->timestamps();

            // Garantiza que un usuario solo pueda votar una vez cada preset
            $table->unique(['id_user', 'id_preset']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};