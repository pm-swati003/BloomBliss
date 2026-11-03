<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Occasion;
use App\Models\Product;
use App\Models\Category;

class OccasionProductSeeder extends Seeder
{
    public function run()
    {
        // Map each occasion slug to the category slug(s) that should be linked
        $mapping = [
            'wedding'     => ['wedding', 'roses'],
            'anniversary' => ['roses'],
            'housewarming'=> ['orchids', 'peonies', 'lilies'],
            'sympathy'    => ['sympathy', 'lilies'],
            'birthday'    => ['birthday', 'roses'],
            'new-baby'    => ['lilies', 'baby', 'orchids'],
        ];

        foreach ($mapping as $occasionSlug => $categorySlugs) {
            $occasion = Occasion::where('slug', $occasionSlug)->first();
            if (!$occasion) {
                $this->command->warn("Occasion '{$occasionSlug}' not found.");
                continue;
            }

            $categoryIds = Category::whereIn('slug', $categorySlugs)->pluck('id');
            if ($categoryIds->isEmpty()) {
                $this->command->warn("No categories found for slugs: " . implode(',', $categorySlugs));
                continue;
            }

            $productIds = Product::whereIn('category_id', $categoryIds)->pluck('id');
            if ($productIds->isEmpty()) {
                $this->command->warn("No products for occasion '{$occasionSlug}' (cats: " . implode(',', $categorySlugs) . ")");
                continue;
            }

            // Attach the products without removing any existing links
            $occasion->products()->syncWithoutDetaching($productIds);
            $this->command->info("Linked " . $productIds->count() . " products to '{$occasionSlug}'");
        }
    }
}