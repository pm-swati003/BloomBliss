<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'discount_percentage',
        'image',
        'images',
        'stock',
        'is_featured',
        'is_best_selling',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'images' => 'array',
        'is_featured' => 'boolean',
        'is_best_selling' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function occasions()
    {
        return $this->belongsToMany(Occasion::class, 'occasion_product');
    }

    // Accessors
    public function getDiscountedPriceAttribute()
    {
        return $this->price * (1 - $this->discount_percentage / 100);
    }
}
