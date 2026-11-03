<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Occasion;
use Illuminate\Support\Str;

class OccasionSeeder extends Seeder
{
    public function run()
    {
        $occasions = [
            [
                'name' => 'Wedding',
                'slug' => 'wedding',
                'description' => 'Perfect arrangements for your special day',
                'is_active' => true,
            ],
            [
                'name' => 'Anniversary',
                'slug' => 'anniversary',
                'description' => 'Honor your love with romantic flowers',
                'is_active' => true,
            ],
            [
                'name' => 'Housewarming',
                'slug' => 'housewarming',
                'description' => 'Welcome to a new chapter in life',
                'is_active' => true,
            ],
            [
                'name' => 'Sympathy',
                'slug' => 'sympathy',
                'description' => 'Express your condolences with grace',
                'is_active' => true,
            ],
            [
                'name' => 'Birthday',
                'slug' => 'birthday',
                'description' => 'Celebrate another year with vibrant blooms',
                'is_active' => true,
            ],
            [
                'name' => 'New Baby',
                'slug' => 'new-baby',
                'description' => 'Celebrate the arrival of little ones',
                'is_active' => true,
            ],
        ];

        foreach ($occasions as $occasion) {
            Occasion::updateOrCreate(
                ['slug' => $occasion['slug']],
                $occasion
            );
        }

        $this->command->info('Occasions seeded successfully!');
    }
}