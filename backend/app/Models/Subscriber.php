<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscriber extends Model
{
    protected $fillable = ['email', 'user_id', 'subscribed_at'];

    protected $casts = [
        'subscribed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function isSubscribed(string $email): bool
    {
        return static::where('email', trim(strtolower($email)))->exists();
    }
}
