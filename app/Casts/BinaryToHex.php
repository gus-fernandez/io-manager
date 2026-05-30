<?php
// App/Casts/BinaryToHex.php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class BinaryToHex implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): string
    {
        return $value !== null ? bin2hex($value) : '';
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): string
    {
        return ctype_xdigit($value) ? hex2bin($value) : $value;
    }
}