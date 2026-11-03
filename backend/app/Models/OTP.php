<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OTP extends Model
{
    use HasFactory;

    protected $table = 'otps';   // <-- Add this line

    protected $fillable = ['email', 'otp', 'purpose', 'expires_at', 'used'];

    protected $casts = [
        'expires_at' => 'datetime',
        'used' => 'boolean',
    ];

    public function isValid()
    {
        return !$this->used && $this->expires_at->isFuture();
    }

    public static function generate($email, $purpose)
    {
        $otp = random_int(100000, 999999);
        $expiresAt = now()->addMinutes(10);

        return self::create([
            'email' => $email,
            'otp' => $otp,
            'purpose' => $purpose,
            'expires_at' => $expiresAt,
        ]);
    }
}