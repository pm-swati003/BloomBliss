<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;

class AddCategoryProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all categories
        $categories = Category::all()->keyBy('slug');
        
        // Image pool (30 images)
        $imagePool = [
            'https://plus.unsplash.com/premium_photo-1676475964992-6404b8db0b53?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zmxvd2Vyc3xlbnwwfHwwfHx8MA%3D%3D',
            'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zmxvd2Vyc3xlbnwwfHwwfHx8MA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1676478746990-4ef5c8ef234a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zmxvd2Vyc3xlbnwwfHwwfHx8MA%3D%3D',
            'https://images.unsplash.com/photo-1613539246066-78db6ec4ff0f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zmxvd2Vyc3xlbnwwfHwwfHx8MA%3D%3D',
            'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zmxvd2Vyc3xlbnwwfHwwfHx8MA%3D%3D',
            'https://images.unsplash.com/photo-1541275055241-329bbdf9a191?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Zmxvd2Vyc3xlbnwwfHwwfHx8MA%3D%3D',
            'https://images.unsplash.com/photo-1508808703020-ef18109db02f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Zmxvd2Vyc3xlbnwwfHwwfHx8MA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1676068243733-df1880c2aef8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Zmxvd2Vyc3xlbnwwfHwwfHx8MA%3D%3D',
            'https://images.unsplash.com/photo-1602615576820-ea14cf3e476a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1460039230329-eb070fc6c77c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://plus.unsplash.com/premium_photo-1674986175088-2d7dda41f7f8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1615280825886-fa817c0a06cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1486944859394-ed1c44255713?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://plus.unsplash.com/premium_photo-1677170014257-16e491ea6516?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1587471577460-bdb4891711ce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1604400247036-e0b38afce25c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://plus.unsplash.com/premium_photo-1676070096487-32dd955e09e0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1471696035578-3d8c78d99684?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1561848355-890d054dc55a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1476994230281-1448088947db?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1488928741225-2aaf732c96cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1567566221756-5282476c4684?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1458929526027-052f5d6a3c5e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1476994230281-1448088947db?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D',
        ];
        
        // Products for each category with prices in the specified ranges
        // Price ranges: Under ₹500, ₹500-₹1000, ₹1000-₹2000, Over ₹2000
        $productsByCategory = [
            'roses' => [
                ['name' => 'Mini Rose Bouquet', 'price' => 299, 'discount' => 10, 'description' => 'Small elegant rose bouquet'],
                ['name' => 'Single Red Rose', 'price' => 99, 'discount' => 5, 'description' => 'Beautiful single red rose'],
                ['name' => 'Rose Bud Collection', 'price' => 450, 'discount' => 15, 'description' => 'Collection of rose buds'],
                ['name' => 'Premium Rose Bouquet', 'price' => 750, 'discount' => 12, 'description' => 'Premium quality roses'],
                ['name' => 'Deluxe Rose Arrangement', 'price' => 950, 'discount' => 18, 'description' => 'Deluxe rose arrangement'],
                ['name' => 'Luxury Rose Collection', 'price' => 1500, 'discount' => 20, 'description' => 'Luxury rose collection', 'is_featured' => true],
                ['name' => 'Grand Rose Bouquet', 'price' => 1800, 'discount' => 15, 'description' => 'Grand rose bouquet'],
                ['name' => 'Royal Rose Arrangement', 'price' => 2500, 'discount' => 10, 'description' => 'Royal rose arrangement', 'is_featured' => true],
                ['name' => 'Premium Rose Garden', 'price' => 3200, 'discount' => 12, 'description' => 'Premium rose garden'],
            ],
            'lilies' => [
                ['name' => 'Single Lily Stem', 'price' => 149, 'discount' => 8, 'description' => 'Beautiful single lily stem'],
                ['name' => 'Lily Bud Bouquet', 'price' => 399, 'discount' => 12, 'description' => 'Elegant lily bud bouquet'],
                ['name' => 'Classic Lily Arrangement', 'price' => 650, 'discount' => 15, 'description' => 'Classic lily arrangement'],
                ['name' => 'Premium Lily Bouquet', 'price' => 850, 'discount' => 18, 'description' => 'Premium lily bouquet'],
                ['name' => 'Deluxe Lily Collection', 'price' => 1200, 'discount' => 20, 'description' => 'Deluxe lily collection'],
                ['name' => 'Luxury Lily Arrangement', 'price' => 1600, 'discount' => 15, 'description' => 'Luxury lily arrangement', 'is_featured' => true],
                ['name' => 'Grand Lily Bouquet', 'price' => 1900, 'discount' => 12, 'description' => 'Grand lily bouquet'],
                ['name' => 'Royal Lily Collection', 'price' => 2800, 'discount' => 10, 'description' => 'Royal lily collection'],
            ],
            'tulips' => [
                ['name' => 'Single Tulip Stem', 'price' => 79, 'discount' => 5, 'description' => 'Colorful single tulip'],
                ['name' => 'Tulip Bud Mix', 'price' => 350, 'discount' => 10, 'description' => 'Mixed tulip buds'],
                ['name' => 'Spring Tulip Bouquet', 'price' => 550, 'discount' => 15, 'description' => 'Fresh spring tulips'],
                ['name' => 'Premium Tulip Arrangement', 'price' => 780, 'discount' => 18, 'description' => 'Premium tulip arrangement'],
                ['name' => 'Deluxe Tulip Collection', 'price' => 1100, 'discount' => 20, 'description' => 'Deluxe tulip collection'],
                ['name' => 'Luxury Tulip Garden', 'price' => 1400, 'discount' => 15, 'description' => 'Luxury tulip garden', 'is_best_selling' => true],
                ['name' => 'Grand Tulip Bouquet', 'price' => 1700, 'discount' => 12, 'description' => 'Grand tulip bouquet'],
                ['name' => 'Royal Tulip Arrangement', 'price' => 2400, 'discount' => 10, 'description' => 'Royal tulip arrangement'],
            ],
            'orchids' => [
                ['name' => 'Single Orchid Plant', 'price' => 199, 'discount' => 8, 'description' => 'Elegant single orchid'],
                ['name' => 'Orchid Bud Collection', 'price' => 480, 'discount' => 12, 'description' => 'Orchid bud collection'],
                ['name' => 'Classic Orchid Arrangement', 'price' => 720, 'discount' => 15, 'description' => 'Classic orchid arrangement'],
                ['name' => 'Premium Orchid Bouquet', 'price' => 920, 'discount' => 18, 'description' => 'Premium orchid bouquet'],
                ['name' => 'Deluxe Orchid Collection', 'price' => 1300, 'discount' => 20, 'description' => 'Deluxe orchid collection'],
                ['name' => 'Luxury Orchid Arrangement', 'price' => 1650, 'discount' => 15, 'description' => 'Luxury orchid arrangement', 'is_featured' => true],
                ['name' => 'Grand Orchid Bouquet', 'price' => 1950, 'discount' => 12, 'description' => 'Grand orchid bouquet'],
                ['name' => 'Royal Orchid Collection', 'price' => 2900, 'discount' => 10, 'description' => 'Royal orchid collection', 'is_featured' => true],
            ],
            'peonies' => [
                ['name' => 'Single Peony Stem', 'price' => 179, 'discount' => 8, 'description' => 'Beautiful single peony'],
                ['name' => 'Peony Bud Bouquet', 'price' => 420, 'discount' => 12, 'description' => 'Elegant peony buds'],
                ['name' => 'Classic Peony Arrangement', 'price' => 680, 'discount' => 15, 'description' => 'Classic peony arrangement'],
                ['name' => 'Premium Peony Bouquet', 'price' => 880, 'discount' => 18, 'description' => 'Premium peony bouquet'],
                ['name' => 'Deluxe Peony Collection', 'price' => 1250, 'discount' => 20, 'description' => 'Deluxe peony collection'],
                ['name' => 'Luxury Peony Arrangement', 'price' => 1550, 'discount' => 15, 'description' => 'Luxury peony arrangement', 'is_featured' => true],
                ['name' => 'Grand Peony Bouquet', 'price' => 1850, 'discount' => 12, 'description' => 'Grand peony bouquet'],
                ['name' => 'Royal Peony Collection', 'price' => 2700, 'discount' => 10, 'description' => 'Royal peony collection'],
            ],
            'bouquets' => [
                ['name' => 'Mini Flower Mix', 'price' => 199, 'discount' => 10, 'description' => 'Small mixed flower bouquet'],
                ['name' => 'Fresh Flower Bundle', 'price' => 380, 'discount' => 12, 'description' => 'Fresh flower bundle'],
                ['name' => 'Classic Mixed Bouquet', 'price' => 620, 'discount' => 15, 'description' => 'Classic mixed bouquet'],
                ['name' => 'Premium Flower Mix', 'price' => 820, 'discount' => 18, 'description' => 'Premium flower mix'],
                ['name' => 'Deluxe Bouquet Collection', 'price' => 1150, 'discount' => 20, 'description' => 'Deluxe bouquet collection'],
                ['name' => 'Luxury Flower Arrangement', 'price' => 1450, 'discount' => 15, 'description' => 'Luxury flower arrangement', 'is_best_selling' => true],
                ['name' => 'Grand Mixed Bouquet', 'price' => 1750, 'discount' => 12, 'description' => 'Grand mixed bouquet'],
                ['name' => 'Royal Flower Collection', 'price' => 2600, 'discount' => 10, 'description' => 'Royal flower collection'],
            ],
            'birthday' => [
                ['name' => 'Birthday Mini Bouquet', 'price' => 249, 'discount' => 10, 'description' => 'Small birthday bouquet'],
                ['name' => 'Happy Birthday Mix', 'price' => 450, 'discount' => 12, 'description' => 'Colorful birthday mix'],
                ['name' => 'Birthday Celebration Bouquet', 'price' => 680, 'discount' => 15, 'description' => 'Birthday celebration bouquet'],
                ['name' => 'Premium Birthday Arrangement', 'price' => 890, 'discount' => 18, 'description' => 'Premium birthday arrangement'],
                ['name' => 'Deluxe Birthday Collection', 'price' => 1280, 'discount' => 20, 'description' => 'Deluxe birthday collection'],
                ['name' => 'Luxury Birthday Bouquet', 'price' => 1580, 'discount' => 15, 'description' => 'Luxury birthday bouquet', 'is_best_selling' => true],
                ['name' => 'Grand Birthday Arrangement', 'price' => 1880, 'discount' => 12, 'description' => 'Grand birthday arrangement'],
                ['name' => 'Royal Birthday Collection', 'price' => 2750, 'discount' => 10, 'description' => 'Royal birthday collection'],
            ],
            'wedding' => [
                ['name' => 'Wedding Mini Centerpiece', 'price' => 399, 'discount' => 8, 'description' => 'Small wedding centerpiece'],
                ['name' => 'Bridal Bouquet Classic', 'price' => 680, 'discount' => 12, 'description' => 'Classic bridal bouquet'],
                ['name' => 'Wedding Flower Arrangement', 'price' => 950, 'discount' => 15, 'description' => 'Elegant wedding arrangement'],
                ['name' => 'Premium Bridal Bouquet', 'price' => 1200, 'discount' => 18, 'description' => 'Premium bridal bouquet'],
                ['name' => 'Deluxe Wedding Collection', 'price' => 1650, 'discount' => 20, 'description' => 'Deluxe wedding collection'],
                ['name' => 'Luxury Wedding Arrangement', 'price' => 1950, 'discount' => 15, 'description' => 'Luxury wedding arrangement', 'is_featured' => true],
                ['name' => 'Grand Wedding Bouquet', 'price' => 2200, 'discount' => 12, 'description' => 'Grand wedding bouquet'],
                ['name' => 'Royal Wedding Collection', 'price' => 3200, 'discount' => 10, 'description' => 'Royal wedding collection', 'is_featured' => true],
            ],
            'sympathy' => [
                ['name' => 'Sympathy Mini Arrangement', 'price' => 299, 'discount' => 8, 'description' => 'Small sympathy arrangement'],
                ['name' => 'Peaceful White Bouquet', 'price' => 520, 'discount' => 12, 'description' => 'Peaceful white bouquet'],
                ['name' => 'Sympathy Flower Arrangement', 'price' => 750, 'discount' => 15, 'description' => 'Thoughtful sympathy arrangement'],
                ['name' => 'Premium Sympathy Bouquet', 'price' => 980, 'discount' => 18, 'description' => 'Premium sympathy bouquet'],
                ['name' => 'Deluxe Sympathy Collection', 'price' => 1350, 'discount' => 20, 'description' => 'Deluxe sympathy collection'],
                ['name' => 'Luxury Sympathy Arrangement', 'price' => 1680, 'discount' => 15, 'description' => 'Luxury sympathy arrangement'],
                ['name' => 'Grand Sympathy Bouquet', 'price' => 1980, 'discount' => 12, 'description' => 'Grand sympathy bouquet'],
                ['name' => 'Royal Sympathy Collection', 'price' => 2850, 'discount' => 10, 'description' => 'Royal sympathy collection'],
            ],
        ];
        
        $imageIndex = 0;
        $totalCreated = 0;
        
        foreach ($productsByCategory as $categorySlug => $products) {
            if (!isset($categories[$categorySlug])) {
                continue;
            }
            
            $category = $categories[$categorySlug];
            
            foreach ($products as $product) {
                // Check if product already exists
                $existingProduct = Product::where('name', $product['name'])->first();
                if ($existingProduct) {
                    // Update existing product price
                    $existingProduct->update([
                        'price' => $product['price'],
                        'discount_percentage' => $product['discount'],
                    ]);
                    continue;
                }
                
                // Create new product
                Product::create([
                    'category_id' => $category->id,
                    'name' => $product['name'],
                    'slug' => Str::slug($product['name']),
                    'description' => $product['description'],
                    'price' => $product['price'],
                    'discount_percentage' => $product['discount'],
                    'image' => $imagePool[$imageIndex % count($imagePool)],
                    'stock' => rand(10, 100),
                    'is_featured' => $product['is_featured'] ?? false,
                    'is_best_selling' => $product['is_best_selling'] ?? false,
                    'is_active' => true,
                ]);
                
                $imageIndex++;
                $totalCreated++;
            }
        }
        
        echo "Created {$totalCreated} new products and updated existing ones with proper price ranges.\n";
    }
}

