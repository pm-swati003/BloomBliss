<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Coupon extends Model
{
    protected $fillable = [
        'code',
        'description',
        'discount_type',
        'value',
        'min_order',
        'for_subscribers_only',
        'valid_from',
        'valid_until',
        'usage_limit',
        'used_count',
        'is_active',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_order' => 'decimal:2',
        'for_subscribers_only' => 'boolean',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function isValid(?string $subscriberEmail = null): bool
    {
        if (!$this->is_active) {
            return false;
        }
        if ($this->valid_from && Carbon::now()->lt($this->valid_from)) {
            return false;
        }
        if ($this->valid_until && Carbon::now()->gt($this->valid_until)) {
            return false;
        }
        if ($this->usage_limit !== null && $this->used_count >= $this->usage_limit) {
            return false;
        }
        if ($this->for_subscribers_only) {
            if (!$subscriberEmail || !Subscriber::isSubscribed($subscriberEmail)) {
                return false;
            }
        }
        return true;
    }

    public function applyDiscount(float $subtotal): float
    {
        if ($this->min_order !== null && $subtotal < (float) $this->min_order) {
            return 0;
        }
        if ($this->discount_type === 'percent') {
            return round($subtotal * ((float) $this->value / 100), 2);
        }
        return min((float) $this->value, $subtotal);
    }
}
