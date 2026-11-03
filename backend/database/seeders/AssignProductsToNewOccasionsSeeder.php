<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Occasion;
use App\Models\Product;

class AssignProductsToNewOccasionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sympathy = Occasion::where('slug', 'sympathy')->first();
        $birthday = Occasion::where('slug', 'birthday')->first();
        $newBaby = Occasion::where('slug', 'new-baby')->first();

        if (!$sympathy || !$birthday || !$newBaby) {
            echo "Occasions not found. Please run AddOccasionsSeeder first.\n";
            return;
        }

        // Get all active products
        $allProducts = Product::where('is_active', true)->get();

        if ($allProducts->isEmpty()) {
            echo "No products found. Please seed products first.\n";
            return;
        }

        // Assign products to sympathy (white, peaceful, elegant products)
        $sympathyProducts = $allProducts->filter(function ($product) {
            $name = strtolower($product->name);
            return (
                strpos($name, 'white') !== false ||
                strpos($name, 'lily') !== false ||
                strpos($name, 'peaceful') !== false ||
                strpos($name, 'elegant') !== false ||
                strpos($name, 'sympathy') !== false
            );
        })->take(20);

        foreach ($sympathyProducts as $product) {
            if (!$sympathy->products()->where('product_id', $product->id)->exists()) {
                $sympathy->products()->attach($product->id);
            }
        }

        // Assign products to birthday (colorful, vibrant, cheerful products)
        $birthdayProducts = $allProducts->filter(function ($product) {
            $name = strtolower($product->name);
            return (
                strpos($name, 'bouquet') !== false ||
                strpos($name, 'collection') !== false ||
                strpos($name, 'mixed') !== false ||
                strpos($name, 'colorful') !== false ||
                strpos($name, 'vibrant') !== false ||
                strpos($name, 'sunshine') !== false ||
                strpos($name, 'garden') !== false
            );
        })->take(20);

        foreach ($birthdayProducts as $product) {
            if (!$birthday->products()->where('product_id', $product->id)->exists()) {
                $birthday->products()->attach($product->id);
            }
        }

        // Assign products to new baby (soft, delicate, pastel products)
        $newBabyProducts = $allProducts->filter(function ($product) {
            $name = strtolower($product->name);
            return (
                strpos($name, 'pink') !== false ||
                strpos($name, 'soft') !== false ||
                strpos($name, 'delicate') !== false ||
                strpos($name, 'baby') !== false ||
                strpos($name, 'bouquet') !== false ||
                strpos($name, 'collection') !== false
            );
        })->take(20);

        foreach ($newBabyProducts as $product) {
            if (!$newBaby->products()->where('product_id', $product->id)->exists()) {
                $newBaby->products()->attach($product->id);
            }
        }

        echo "Assigned products to new occasions:\n";
        echo "- Sympathy: " . $sympathy->products()->count() . " products\n";
        echo "- Birthday: " . $birthday->products()->count() . " products\n";
        echo "- New Baby: " . $newBaby->products()->count() . " products\n";
    }
}

