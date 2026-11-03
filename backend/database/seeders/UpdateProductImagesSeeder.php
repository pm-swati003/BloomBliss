<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class UpdateProductImagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // New flower images from Unsplash - 30 images provided
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
        
        // Fallback images by category (using first few images from pool)
        $categoryFallbacks = [
            'roses' => $imagePool[0],
            'lilies' => $imagePool[1],
            'tulips' => $imagePool[2],
            'orchids' => $imagePool[3],
            'peonies' => $imagePool[4],
            'bouquets' => $imagePool[5],
            'birthday' => $imagePool[6],
            'wedding' => $imagePool[7],
            'sympathy' => $imagePool[8],
        ];

        // Get all products with their categories, ordered by ID
        $products = Product::with('category')->orderBy('id')->get();
        $updated = 0;
        $imageIndex = 0;
        
        foreach ($products as $product) {
            // Assign images from pool in order, cycling through if needed
            $imageUrl = $imagePool[$imageIndex % count($imagePool)];
            
            // Update product with image
            $product->update(['image' => $imageUrl]);
            $updated++;
            $imageIndex++;
        }
        
        echo "Updated {$updated} products with new Unsplash images.\n";
    }
}
