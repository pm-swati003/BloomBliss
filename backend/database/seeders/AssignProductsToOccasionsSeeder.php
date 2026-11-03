<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Occasion;
use App\Models\Product;

class AssignProductsToOccasionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $wedding = Occasion::where('slug', 'wedding')->first();
        $anniversary = Occasion::where('slug', 'anniversary')->first();
        $housewarming = Occasion::where('slug', 'housewarming')->first();

        if (!$wedding || !$anniversary || !$housewarming) {
            echo "Occasions not found. Please run AddOccasionsSeeder first.\n";
            return;
        }

        // Get all active products
        $allProducts = Product::where('is_active', true)->get();

        if ($allProducts->isEmpty()) {
            echo "No products found. Please seed products first.\n";
            return;
        }

        // Assign products to wedding (elegant, premium products)
        $weddingProducts = $allProducts->filter(function ($product) {
            $name = strtolower($product->name);
            return (
                strpos($name, 'rose') !== false ||
                strpos($name, 'lily') !== false ||
                strpos($name, 'orchid') !== false ||
                strpos($name, 'premium') !== false ||
                strpos($name, 'luxury') !== false ||
                strpos($name, 'royal') !== false ||
                strpos($name, 'deluxe') !== false ||
                strpos($name, 'grand') !== false ||
                $product->is_featured === true
            );
        })->take(20);

        foreach ($weddingProducts as $product) {
            if (!$wedding->products()->where('product_id', $product->id)->exists()) {
                $wedding->products()->attach($product->id);
            }
        }

        // Assign products to anniversary (romantic, elegant products)
        $anniversaryProducts = $allProducts->filter(function ($product) {
            $name = strtolower($product->name);
            return (
                strpos($name, 'rose') !== false ||
                strpos($name, 'tulip') !== false ||
                strpos($name, 'peony') !== false ||
                strpos($name, 'bouquet') !== false ||
                strpos($name, 'collection') !== false ||
                strpos($name, 'elegant') !== false ||
                strpos($name, 'delight') !== false
            );
        })->take(20);

        foreach ($anniversaryProducts as $product) {
            if (!$anniversary->products()->where('product_id', $product->id)->exists()) {
                $anniversary->products()->attach($product->id);
            }
        }

        // Assign products to housewarming (fresh, vibrant products)
        $housewarmingProducts = $allProducts->filter(function ($product) {
            $name = strtolower($product->name);
            return (
                strpos($name, 'bouquet') !== false ||
                strpos($name, 'garden') !== false ||
                strpos($name, 'collection') !== false ||
                strpos($name, 'mixed') !== false ||
                strpos($name, 'arrangement') !== false ||
                strpos($name, 'sunshine') !== false ||
                strpos($name, 'spring') !== false
            );
        })->take(20);

        foreach ($housewarmingProducts as $product) {
            if (!$housewarming->products()->where('product_id', $product->id)->exists()) {
                $housewarming->products()->attach($product->id);
            }
        }

        echo "Assigned products to occasions:\n";
        echo "- Wedding: " . $wedding->products()->count() . " products\n";
        echo "- Anniversary: " . $anniversary->products()->count() . " products\n";
        echo "- Housewarming: " . $housewarming->products()->count() . " products\n";
    }
}

