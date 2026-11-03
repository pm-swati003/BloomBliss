<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Occasion;
use App\Models\Product;

class AssignNewOccasionImagesToProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sympathy images (15 images)
        $sympathyImages = [
            'https://media.istockphoto.com/id/1313444277/photo/cemetery.jpg?s=612x612&w=0&k=20&c=G10hSph161hBH6XYidiXQkqhv1L1T1ZEiRmeA8bCXKA=',
            'https://media.istockphoto.com/id/627008872/photo/paying-his-respects.jpg?s=612x612&w=0&k=20&c=KFkgJFPSD6OP6Iprz_R9hdzvrSWifGo93fSBfuIpxXo=',
            'https://media.istockphoto.com/id/157563893/photo/funeral.jpg?s=612x612&w=0&k=20&c=MYYYIs9WfNmRHt8Ry9MnNtswIOL-OsYhcr3l_2kw4Js=',
            'https://media.istockphoto.com/id/958702010/photo/flowers-on-an-altar-in-the-church-and-the-candles-on-background.jpg?s=612x612&w=0&k=20&c=YHvpsr_NXZ5ubIf53wosPDrrWUjAd7OvJzSNpq9gvU4=',
            'https://media.istockphoto.com/id/507110096/photo/coffin-in-morque.jpg?s=612x612&w=0&k=20&c=7e0L82PAxmBXEyK9SNJSEBn25Ws5HiyCE9A668Nes3U=',
            'https://media.istockphoto.com/id/1132193884/photo/a-funeral-and-visit-to-a-grave-of-japan-the-woman-of-the-senior-worships-the-ancestral-soul.jpg?s=612x612&w=0&k=20&c=4Ga5DJdZ9n6fS4BsN_fs6o6N_uLHGUo0gzTSlmsVP_8=',
            'https://media.istockphoto.com/id/1447462383/photo/close-up-of-female-hand-on-coffin.jpg?s=612x612&w=0&k=20&c=3KPskZxchQd7f5d6yytS3wy3UBbo8ZKptpQxt9WsYKs=',
            'https://media.istockphoto.com/id/2045430218/photo/hands-rose-and-a-person-at-a-funeral-in-a-cemetery-in-grief-while-mourning-loss-at-a-memorial.jpg?s=612x612&w=0&k=20&c=sgyhN_VlKSfl0Awge1VA9V5qU94pZRlL8rzOCl02Jlo=',
            'https://media.istockphoto.com/id/171147496/photo/flowers-bouquet.jpg?s=612x612&w=0&k=20&c=LHm47ntufheUWzIZOX4Wpv6g_orWmIHUhr5oEiY8sv0=',
            'https://media.istockphoto.com/id/680188332/photo/white-funeral-flowers.jpg?s=612x612&w=0&k=20&c=u8pVG4FJ9G-nFWYE5HY-AP4HQpcmvAf7823BJ-0rDLk=',
            'https://media.istockphoto.com/id/1128780856/photo/flower-on-a-grave-in-a-cemetery.jpg?s=612x612&w=0&k=20&c=TM_cPBt9pe0wQ7sZ8w6kFDte--431_hrIvTPFryKnOY=',
            'https://media.istockphoto.com/id/536407467/photo/silk-flowers-on-a-gravestone-soft-focus.jpg?s=612x612&w=0&k=20&c=aiKKgy1GikaF0atpP9l_dri2uFo5_FTj7hluRR10ubA=',
            'https://media.istockphoto.com/id/157648535/photo/wooden-color-casket-with-flowers-and-a-rose-on-top.jpg?s=612x612&w=0&k=20&c=1DUwE7L7uDN7NlB8iofQbnm5gI5nyjWB7XMdDr3VYhY=',
            'https://media.istockphoto.com/id/1309899364/photo/cemetery.jpg?s=612x612&w=0&k=20&c=-aj5HeSOqG-iVZBM2QUZUKvJpE-D9NBBGlFC61Lm_34=',
            'https://media.istockphoto.com/id/121193414/photo/white-roses-on-purple.jpg?s=612x612&w=0&k=20&c=xwCIJA4VAg2q9vpQoWBb2mY7zyebU1StpQfs5658dac=',
        ];

        // Birthday images (13 images)
        $birthdayImages = [
            'https://images.unsplash.com/photo-1696238404375-2f7c1734131b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zmxvd2VycyUyMGJpcnRoZGF5fGVufDB8fDB8fHww',
            'https://plus.unsplash.com/premium_photo-1692880430187-485473549efc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zmxvd2VycyUyMGJpcnRoZGF5fGVufDB8fDB8fHww',
            'https://plus.unsplash.com/premium_photo-1692880429618-a082e829a9b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGZsb3dlcnMlMjBiaXJ0aGRheXxlbnwwfHwwfHx8MA%3D%3D',
            'https://images.unsplash.com/photo-1599577011266-9c006a93c294?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZsb3dlcnMlMjBiaXJ0aGRheXxlbnwwfHwwfHx8MA%3D%3D',
            'https://media.istockphoto.com/id/1406696160/photo/happy-birthday-card-on-beautiful-flower-bouquet-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=dCZdEcX6yK6BeUcrXho1Uom6UMrIgZfrgAH6A5qfxCs=',
            'https://media.istockphoto.com/id/576753920/photo/happy-birthday-card-with-bouquet-of-summer-flowers.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZCV9XMoK9Y8S1fQ54sgOlI7VReeiHbhVlKUHnka5ysE=',
            'https://media.istockphoto.com/id/2193800295/photo/happy-birthday-text-message-on-paper-card-with-beautiful-flowers-decoration.jpg?s=612x612&w=0&k=20&c=uYroaBR5V_QmArzqvkrqET6kUTnNFw7q584a1j1eSnU=',
            'https://media.istockphoto.com/id/1363698922/photo/happy-birthday-message-card-and-turnip-bouqet.jpg?s=612x612&w=0&k=20&c=t6wnf1EcurrHD8xzv5S84g8bX0TOoF2izjhgmqAquYs=',
            'https://plus.unsplash.com/premium_photo-1677005250683-f42e33b64d8f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zmxvd2VycyUyMGRlY29yZSUyMGluJTIwYmlydGhkYXl8ZW58MHx8MHx8fDA%3D',
            'https://media.istockphoto.com/id/1531084522/photo/gender-reveal-party-decoration.jpg?s=612x612&w=0&k=20&c=SQhgfGGoBC8ors0faUGVGIjnpAJn47PgNIu6DXG-VSE=',
            'https://media.istockphoto.com/id/1486585005/photo/birthday-cake-happy-birthday-cake-birthday-cake-stock-photo.jpg?s=612x612&w=0&k=20&c=ybMSSF54wiFygK2OFMLV6dditb8Zju5j0zkgWWM5cqs=',
            'https://media.istockphoto.com/id/1352398822/photo/birthday-cake-on-a-background-balloons-party-decor-baby-shower-party-decor-celebration.jpg?s=612x612&w=0&k=20&c=UPBPxJLpRJJ65NJBBUr7ZmuarW2rGOqOiQXOXoWGOjU=',
            'https://images.unsplash.com/photo-1696238404375-2f7c1734131b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zmxvd2VycyUyMGJpcnRoZGF5fGVufDB8fDB8fHww',
        ];

        // New Baby images (9 images)
        $newBabyImages = [
            'https://media.istockphoto.com/id/2196523986/photo/twin-baby-girls-wrapped-in-soft-pink-blankets-wearing-floral-headbands.jpg?s=2048x2048&w=is&k=20&c=2XupGg6MqSHRbHbNOb3Q4SkBePbfoc9tmyOA-TIZHto=',
            'https://images.unsplash.com/photo-1525724359365-66b061e0e377?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zmxvd2VycyUyMGZvciUyMHdlbGNvbWUlMjBuZXdib3JuJTIwYmFieXxlbnwwfHwwfHx8MA%3D%3D',
            'https://media.istockphoto.com/id/1278765537/photo/greeting-at-the-front-door.webp?a=1&b=1&s=612x612&w=0&k=20&c=nPwRnQEEBsYB_DkT9TwAJ9GKI6laiugaR6YGPPE2eZ4=',
            'https://media.istockphoto.com/id/501151587/photo/baby-lilac-flowers-small-girl-sleeping-newborn-child-greeting-card.webp?a=1&b=1&s=612x612&w=0&k=20&c=R0av94IusQ7n0D9zWt18b1A3xqnpMMGwQNRjzZnBXxo=',
            'https://media.istockphoto.com/id/509309554/photo/baby-shower-decoration.jpg?s=612x612&w=0&k=20&c=mguxwoXePs7TM1dDmdBiBvYSYwGs0mbftSGI2qV7twM=',
            'https://media.istockphoto.com/id/1388266618/photo/close-up-of-pregnant-woman-with-flowers-in-sunny-summer-day.webp?a=1&b=1&s=612x612&w=0&k=20&c=ilaA9i6HlUYIJ617_F1jWmPjcD1nZdchE6zdFD917yo=',
            'https://images.unsplash.com/photo-1662465317187-e1ba62ce0873?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D',
            'https://images.unsplash.com/photo-1747029467487-94dbcb6589cd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE4fHx8ZW58MHx8fHx8',
            'https://media.istockphoto.com/id/501151587/photo/baby-lilac-flowers-small-girl-sleeping-newborn-child-greeting-card.webp?a=1&b=1&s=612x612&w=0&k=20&c=R0av94IusQ7n0D9zWt18b1A3xqnpMMGwQNRjzZnBXxo=',
        ];

        // Get occasions
        $sympathy = Occasion::where('slug', 'sympathy')->first();
        $birthday = Occasion::where('slug', 'birthday')->first();
        $newBaby = Occasion::where('slug', 'new-baby')->first();

        if (!$sympathy || !$birthday || !$newBaby) {
            echo "Occasions not found. Please run AddOccasionsSeeder first.\n";
            return;
        }

        // Assign sympathy images to sympathy products
        $sympathyProducts = $sympathy->products()->get();
        $sympathyUpdated = 0;
        foreach ($sympathyProducts as $index => $product) {
            $imageIndex = $index % count($sympathyImages);
            $product->update(['image' => $sympathyImages[$imageIndex]]);
            $sympathyUpdated++;
        }

        // Assign birthday images to birthday products
        $birthdayProducts = $birthday->products()->get();
        $birthdayUpdated = 0;
        foreach ($birthdayProducts as $index => $product) {
            $imageIndex = $index % count($birthdayImages);
            $product->update(['image' => $birthdayImages[$imageIndex]]);
            $birthdayUpdated++;
        }

        // Assign new baby images to new baby products
        $newBabyProducts = $newBaby->products()->get();
        $newBabyUpdated = 0;
        foreach ($newBabyProducts as $index => $product) {
            $imageIndex = $index % count($newBabyImages);
            $product->update(['image' => $newBabyImages[$imageIndex]]);
            $newBabyUpdated++;
        }

        echo "Assigned occasion images to products:\n";
        echo "- Sympathy: {$sympathyUpdated} products updated\n";
        echo "- Birthday: {$birthdayUpdated} products updated\n";
        echo "- New Baby: {$newBabyUpdated} products updated\n";
    }
}

