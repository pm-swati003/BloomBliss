<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class UpdateProductPricesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all products that have prices outside the range (over 2000)
        $products = Product::all();
        $updated = 0;
        
        foreach ($products as $product) {
            // Only update products with prices over 2000 (old pricing)
            if ($product->price > 2000) {
                // Convert old price to new price range
                // Old prices were in thousands (49000, 79000, etc.)
                // Convert to new range: divide by 100 and adjust
                $oldPrice = $product->price;
                
                // Convert to new pricing structure
                // Map old prices to new ranges
                if ($oldPrice >= 80000) {
                    // Premium products -> Over ₹2000 range
                    $newPrice = rand(2200, 3500);
                } elseif ($oldPrice >= 60000) {
                    // Mid-high products -> ₹1000-₹2000 range
                    $newPrice = rand(1200, 1900);
                } elseif ($oldPrice >= 40000) {
                    // Mid products -> ₹500-₹1000 range
                    $newPrice = rand(600, 950);
                } else {
                    // Lower products -> Under ₹500 range
                    $newPrice = rand(200, 480);
                }
                
                $product->update(['price' => $newPrice]);
                $updated++;
            }
        }
        
        echo "Updated {$updated} products with new price ranges.\n";
    }
}

