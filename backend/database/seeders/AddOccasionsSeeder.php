<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Occasion;
use Illuminate\Support\Str;

class AddOccasionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $occasions = [
            [
                'name' => 'Wedding',
                'slug' => 'wedding',
                'description' => 'Perfect arrangements for your special day',
                'image' => 'https://media.istockphoto.com/id/2198211151/photo/vivid-orange-marigold-field-in-full-bloom-during-sunny-day-in-india.jpg?s=612x612&w=0&k=20&c=QJTqjy-AXxxNXxnVEUz7x1vbwkHm5GLYEv04Nf6uKVM=',
                'is_active' => true,
            ],
            [
                'name' => 'Anniversary',
                'slug' => 'anniversary',
                'description' => 'Honor your love with romantic flowers',
                'image' => 'https://media.istockphoto.com/id/1468559011/photo/beautiful-indian-women-in-saris-decorating-rangoli-with-oil-lamps-sitting-at-the-entrance-of.jpg?s=612x612&w=0&k=20&c=DQMy-yOR5Qs-00gH27pXOYlA_OOLBR5XRjBXR1P49zY=',
                'is_active' => true,
            ],
            [
                'name' => 'Housewarming',
                'slug' => 'housewarming',
                'description' => 'Welcome to a new chapter in life',
                'image' => 'https://media.istockphoto.com/id/1477224855/photo/image-of-indian-uruli-bowl-filled-with-pink-orange-and-white-flowers-marigolds-daisies-and.jpg?s=612x612&w=0&k=20&c=Wp6Y0SsbG8Xi22F5y1k00Hz6FHpTdzAyLxRgkit1V4w=',
                'is_active' => true,
            ],
            [
                'name' => 'Sympathy',
                'slug' => 'sympathy',
                'description' => 'Express your condolences with grace',
                'image' => 'https://media.istockphoto.com/id/1313444277/photo/cemetery.jpg?s=612x612&w=0&k=20&c=G10hSph161hBH6XYidiXQkqhv1L1T1ZEiRmeA8bCXKA=',
                'is_active' => true,
            ],
            [
                'name' => 'Birthday',
                'slug' => 'birthday',
                'description' => 'Celebrate another year with vibrant blooms',
                'image' => 'https://images.unsplash.com/photo-1696238404375-2f7c1734131b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zmxvd2VycyUyMGJpcnRoZGF5fGVufDB8fDB8fHww',
                'is_active' => true,
            ],
            [
                'name' => 'New Baby',
                'slug' => 'new-baby',
                'description' => 'Celebrate the arrival of little ones',
                'image' => 'https://media.istockphoto.com/id/2196523986/photo/twin-baby-girls-wrapped-in-soft-pink-blankets-wearing-floral-headbands.jpg?s=2048x2048&w=is&k=20&c=2XupGg6MqSHRbHbNOb3Q4SkBePbfoc9tmyOA-TIZHto=',
                'is_active' => true,
            ],
        ];

        foreach ($occasions as $occasion) {
            Occasion::updateOrCreate(
                ['slug' => $occasion['slug']],
                $occasion
            );
        }
    }
}

