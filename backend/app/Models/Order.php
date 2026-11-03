<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'rider_user_id',
        'order_number',
        'subtotal',
        'shipping',
        'discount',
        'total',
        'status',
        'tracking_number',
        'shipping_address_id',
        'payment_method_id',
        'coupon_id',
        'delivery_date',
        'delivery_time',
        'rider_lat',
        'rider_lng',
        'estimated_delivery_at',
        'delivery_lat',
        'delivery_lng',
        'distance_km',
        'delivery_earnings',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'delivery_date' => 'date',
        'estimated_delivery_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /** Delivery person (rider) who is delivering this order */
    public function rider()
    {
        return $this->belongsTo(User::class, 'rider_user_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function shippingAddress()
    {
        return $this->belongsTo(Address::class, 'shipping_address_id');
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }
}
