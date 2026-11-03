<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function get(string $key, $default = null)
    {
        $item = Cache::remember("setting.{$key}", 300, fn () => static::where('key', $key)->first());
        return $item ? json_decode($item->value, true) ?? $item->value : $default;
    }

    public static function set(string $key, $value): void
    {
        $encoded = is_array($value) || is_object($value) ? json_encode($value) : $value;
        static::updateOrCreate(['key' => $key], ['value' => $encoded]);
        Cache::forget("setting.{$key}");
    }
}
