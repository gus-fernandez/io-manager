<?php
// App/Casts/BinaryToHex.php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * Castea datos binarios de la base de datos a formato Hexadecimal.
 * * Útil para almacenar datos binarios crudos (ej. configuraciones ESP32)
 * y leerlos como strings legibles en la aplicación.
 */
class BinaryToHex implements CastsAttributes
{
    /**
     * @param  Model  $model
     * @param  string  $key
     * @param  mixed  $value  Datos binarios desde la BD
     * @param  array  $attributes
     * @return string  Representación hexadecimal
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): string
    {
        return $value !== null ? bin2hex($value) : '';
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): string
    {
        return ctype_xdigit($value) ? hex2bin($value) : $value;
    }
}