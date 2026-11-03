<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;

class FlowerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Categories
        $categories = [
            ['name' => 'Roses', 'slug' => 'roses', 'description' => 'Beautiful roses in various colors'],
            ['name' => 'Lilies', 'slug' => 'lilies', 'description' => 'Elegant lilies for special occasions'],
            ['name' => 'Tulips', 'slug' => 'tulips', 'description' => 'Colorful tulips perfect for spring'],
            ['name' => 'Orchids', 'slug' => 'orchids', 'description' => 'Exotic orchids for sophisticated arrangements'],
            ['name' => 'Peonies', 'slug' => 'peonies', 'description' => 'Luxurious peonies in soft pastels'],
            ['name' => 'Bouquets', 'slug' => 'bouquets', 'description' => 'Mixed flower bouquets'],
            ['name' => 'Birthday', 'slug' => 'birthday', 'description' => 'Perfect flowers for birthdays'],
            ['name' => 'Wedding', 'slug' => 'wedding', 'description' => 'Elegant wedding arrangements'],
            ['name' => 'Sympathy', 'slug' => 'sympathy', 'description' => 'Thoughtful sympathy arrangements'],
        ];

        $categoryModels = [];
        foreach ($categories as $category) {
            $categoryModels[$category['slug']] = Category::create($category);
        }

        // Image URLs - using verified Unsplash URLs with proper flower images
        $productImageMap = [
            // Roses - Red, Pink, White, Yellow, Mixed
            'Classic Red Rose Bouquet' => 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=800&fit=crop',
            'Premium Red Roses' => 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&h=800&fit=crop',
            'Pink Rose Collection' => 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&h=800&fit=crop',
            'White Rose Elegance' => 'https://images.unsplash.com/photo-1518621012428-8ae0b0c3c4c4?w=800&h=800&fit=crop',
            'Yellow Rose Sunshine' => 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
            'Mixed Rose Bouquet' => 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=800&fit=crop',
            
            // Lilies - White, Pink, Orange - using diverse lily images
            'Elegant Lily Arrangement' => 'https://images.unsplash.com/photo-1595515106385-3a4233f24749?w=800&h=800&fit=crop',
            'White Lily Bouquet' => 'https://images.unsplash.com/photo-1518621012428-8ae0b0c3c4c4?w=800&h=800&fit=crop',
            'Pink Lily Delight' => 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&h=800&fit=crop',
            'Orange Lily Collection' => 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
            
            // Tulips - Red, Yellow, Purple, Mixed - using diverse tulip images
            'Tulip Garden' => 'https://images.unsplash.com/photo-1520763185298-1b434c9198e6?w=800&h=800&fit=crop',
            'Red Tulip Bouquet' => 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop',
            'Yellow Tulip Spring' => 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=800&h=800&fit=crop',
            'Purple Tulip Mix' => 'https://images.unsplash.com/photo-1520763185298-1b434c9198e6?w=800&h=800&fit=crop',
            'Mixed Tulip Arrangement' => 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop',
            
            // Orchids - White, Purple, Pink - using diverse orchid images
            'Orchid Collection' => 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=800&h=800&fit=crop',
            'White Orchid Elegance' => 'https://images.unsplash.com/photo-1518621012428-8ae0b0c3c4c4?w=800&h=800&fit=crop',
            'Purple Orchid Delight' => 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=800&h=800&fit=crop',
            'Pink Orchid Arrangement' => 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&h=800&fit=crop',
            
            // Peonies - Pink, White - using proper peony images
            'Romantic Peonies' => 'https://images.unsplash.com/photo-1520763185298-1b434c9198e6?w=800&h=800&fit=crop',
            'Pink Peony Bouquet' => 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&h=800&fit=crop',
            'White Peony Collection' => 'https://images.unsplash.com/photo-1518621012428-8ae0b0c3c4c4?w=800&h=800&fit=crop',
            
            // Bouquets - Mixed flowers
            'Spring Mix Flowers' => 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=800&fit=crop',
            'Wildflower Bundle' => 'https://images.unsplash.com/photo-1597848212624-e530bb7324f7?w=800&h=800&fit=crop',
            'Garden Fresh Mix' => 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=800&fit=crop',
            'Sunflower Delight' => 'https://images.unsplash.com/photo-1597848212624-e530bb7324f7?w=800&h=800&fit=crop',
            'Pink Paradise' => 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=800&fit=crop',
            'White Elegance' => 'https://images.unsplash.com/photo-1518621012428-8ae0b0c3c4c4?w=800&h=800&fit=crop',
            'Rainbow Mix' => 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=800&fit=crop',
            'Autumn Harvest' => 'https://images.unsplash.com/photo-1597848212624-e530bb7324f7?w=800&h=800&fit=crop',
            
            // Birthday
            'Birthday Celebration Bouquet' => 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=800&fit=crop',
            'Happy Birthday Mix' => 'https://images.unsplash.com/photo-1597848212624-e530bb7324f7?w=800&h=800&fit=crop',
            'Birthday Rose Special' => 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=800&fit=crop',
            
            // Wedding
            'Wedding Centerpiece Collection' => 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=800&fit=crop',
            'Bridal Bouquet Premium' => 'https://images.unsplash.com/photo-1518621012428-8ae0b0c3c4c4?w=800&h=800&fit=crop',
            'Wedding Rose Arrangement' => 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=800&fit=crop',
            
            // Sympathy
            'Sympathy White Lilies' => 'https://images.unsplash.com/photo-1595515106385-3a4233f24749?w=800&h=800&fit=crop',
            'Peaceful Sympathy Arrangement' => 'https://images.unsplash.com/photo-1595515106385-3a4233f24749?w=800&h=800&fit=crop',
        ];
        
        // Fallback images by category
        $categoryFallbacks = [
            'roses' => 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=800&fit=crop',
            'lilies' => 'https://images.unsplash.com/photo-1595515106385-3a4233f24749?w=800&h=800&fit=crop',
            'tulips' => 'https://images.unsplash.com/photo-1520763185298-1b434c9198e6?w=800&h=800&fit=crop',
            'orchids' => 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=800&h=800&fit=crop',
            'peonies' => 'https://images.unsplash.com/photo-1520763185298-1b434c9198e6?w=800&h=800&fit=crop',
            'bouquets' => 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=800&fit=crop',
            'birthday' => 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=800&fit=crop',
            'wedding' => 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=800&fit=crop',
            'sympathy' => 'https://images.unsplash.com/photo-1595515106385-3a4233f24749?w=800&h=800&fit=crop',
        ];

        // Create Products (Flowers)
        $products = [
            // Roses
            ['name' => 'Classic Red Rose Bouquet', 'category' => 'roses', 'price' => 49000, 'discount' => 15, 'description' => 'A dozen beautiful red roses', 'is_best_selling' => true],
            ['name' => 'Premium Red Roses', 'category' => 'roses', 'price' => 79000, 'discount' => 10, 'description' => 'Premium quality red roses', 'is_featured' => true],
            ['name' => 'Pink Rose Collection', 'category' => 'roses', 'price' => 55000, 'discount' => 20, 'description' => 'Delicate pink roses'],
            ['name' => 'White Rose Elegance', 'category' => 'roses', 'price' => 65000, 'discount' => 12, 'description' => 'Pure white roses'],
            ['name' => 'Yellow Rose Sunshine', 'category' => 'roses', 'price' => 52000, 'discount' => 18, 'description' => 'Bright yellow roses'],
            ['name' => 'Mixed Rose Bouquet', 'category' => 'roses', 'price' => 68000, 'discount' => 15, 'description' => 'Mixed color roses'],

            // Lilies
            ['name' => 'Elegant Lily Arrangement', 'category' => 'lilies', 'price' => 59000, 'discount' => 43, 'description' => 'Beautiful lily arrangement', 'is_best_selling' => true],
            ['name' => 'White Lily Bouquet', 'category' => 'lilies', 'price' => 62000, 'discount' => 25, 'description' => 'Pure white lilies'],
            ['name' => 'Pink Lily Delight', 'category' => 'lilies', 'price' => 57000, 'discount' => 30, 'description' => 'Soft pink lilies'],
            ['name' => 'Orange Lily Collection', 'category' => 'lilies', 'price' => 61000, 'discount' => 22, 'description' => 'Vibrant orange lilies'],

            // Tulips
            ['name' => 'Tulip Garden', 'category' => 'tulips', 'price' => 54000, 'discount' => 20, 'description' => 'Colorful tulip garden', 'is_best_selling' => true],
            ['name' => 'Red Tulip Bouquet', 'category' => 'tulips', 'price' => 48000, 'discount' => 15, 'description' => 'Bright red tulips'],
            ['name' => 'Yellow Tulip Spring', 'category' => 'tulips', 'price' => 50000, 'discount' => 18, 'description' => 'Sunny yellow tulips'],
            ['name' => 'Purple Tulip Mix', 'category' => 'tulips', 'price' => 56000, 'discount' => 25, 'description' => 'Elegant purple tulips'],
            ['name' => 'Mixed Tulip Arrangement', 'category' => 'tulips', 'price' => 58000, 'discount' => 20, 'description' => 'Mixed color tulips'],

            // Orchids
            ['name' => 'Orchid Collection', 'category' => 'orchids', 'price' => 89000, 'discount' => 15, 'description' => 'Exotic orchid collection', 'is_featured' => true],
            ['name' => 'White Orchid Elegance', 'category' => 'orchids', 'price' => 95000, 'discount' => 12, 'description' => 'Pure white orchids'],
            ['name' => 'Purple Orchid Delight', 'category' => 'orchids', 'price' => 92000, 'discount' => 18, 'description' => 'Beautiful purple orchids'],
            ['name' => 'Pink Orchid Arrangement', 'category' => 'orchids', 'price' => 88000, 'discount' => 20, 'description' => 'Delicate pink orchids'],

            // Peonies
            ['name' => 'Romantic Peonies', 'category' => 'peonies', 'price' => 84000, 'discount' => 8, 'description' => 'Luxurious peonies', 'is_featured' => true],
            ['name' => 'Pink Peony Bouquet', 'category' => 'peonies', 'price' => 78000, 'discount' => 10, 'description' => 'Soft pink peonies'],
            ['name' => 'White Peony Collection', 'category' => 'peonies', 'price' => 82000, 'discount' => 12, 'description' => 'Elegant white peonies'],

            // Bouquets
            ['name' => 'Spring Mix Flowers', 'category' => 'bouquets', 'price' => 39000, 'discount' => 23, 'description' => 'Fresh spring mix', 'is_best_selling' => true],
            ['name' => 'Wildflower Bundle', 'category' => 'bouquets', 'price' => 44000, 'discount' => 38, 'description' => 'Colorful wildflowers'],
            ['name' => 'Garden Fresh Mix', 'category' => 'bouquets', 'price' => 46000, 'discount' => 30, 'description' => 'Fresh garden mix'],
            ['name' => 'Sunflower Delight', 'category' => 'bouquets', 'price' => 42000, 'discount' => 25, 'description' => 'Bright sunflowers', 'is_best_selling' => true],
            ['name' => 'Pink Paradise', 'category' => 'bouquets', 'price' => 64000, 'discount' => 18, 'description' => 'Pink flower paradise'],
            ['name' => 'White Elegance', 'category' => 'bouquets', 'price' => 71000, 'discount' => 12, 'description' => 'Elegant white flowers'],
            ['name' => 'Rainbow Mix', 'category' => 'bouquets', 'price' => 58000, 'discount' => 20, 'description' => 'Colorful rainbow mix'],
            ['name' => 'Autumn Harvest', 'category' => 'bouquets', 'price' => 55000, 'discount' => 22, 'description' => 'Warm autumn colors'],

            // Birthday
            ['name' => 'Birthday Celebration Bouquet', 'category' => 'birthday', 'price' => 45000, 'discount' => 20, 'description' => 'Perfect for birthdays'],
            ['name' => 'Happy Birthday Mix', 'category' => 'birthday', 'price' => 50000, 'discount' => 18, 'description' => 'Colorful birthday mix'],
            ['name' => 'Birthday Rose Special', 'category' => 'birthday', 'price' => 60000, 'discount' => 15, 'description' => 'Special birthday roses'],

            // Wedding
            ['name' => 'Wedding Centerpiece Collection', 'category' => 'wedding', 'price' => 129000, 'discount' => 10, 'description' => 'Elegant wedding centerpieces', 'is_featured' => true],
            ['name' => 'Bridal Bouquet Premium', 'category' => 'wedding', 'price' => 115000, 'discount' => 12, 'description' => 'Luxurious bridal bouquet'],
            ['name' => 'Wedding Rose Arrangement', 'category' => 'wedding', 'price' => 98000, 'discount' => 15, 'description' => 'Beautiful wedding roses'],

            // Sympathy
            ['name' => 'Sympathy White Lilies', 'category' => 'sympathy', 'price' => 67000, 'discount' => 8, 'description' => 'Thoughtful white lilies'],
            ['name' => 'Peaceful Sympathy Arrangement', 'category' => 'sympathy', 'price' => 72000, 'discount' => 10, 'description' => 'Peaceful arrangement'],
        ];

        foreach ($products as $product) {
            $category = $categoryModels[$product['category']];
            $categorySlug = $product['category'];
            
            // Get specific image for this product, or use category fallback
            $imageUrl = $productImageMap[$product['name']] ?? null;
            
            if (!$imageUrl) {
                $imageUrl = $categoryFallbacks[$categorySlug] ?? 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=800&fit=crop&q=80';
            }
            
            Product::create([
                'category_id' => $category->id,
                'name' => $product['name'],
                'slug' => Str::slug($product['name']),
                'description' => $product['description'],
                'price' => $product['price'],
                'discount_percentage' => $product['discount'],
                'image' => $imageUrl,
                'stock' => rand(10, 100),
                'is_featured' => $product['is_featured'] ?? false,
                'is_best_selling' => $product['is_best_selling'] ?? false,
                'is_active' => true,
            ]);
        }
    }
}
