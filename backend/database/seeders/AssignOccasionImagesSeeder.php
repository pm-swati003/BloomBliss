<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Occasion;

class AssignOccasionImagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Wedding images
        $weddingImages = [
            'https://media.istockphoto.com/id/2198211151/photo/vivid-orange-marigold-field-in-full-bloom-during-sunny-day-in-india.jpg?s=612x612&w=0&k=20&c=QJTqjy-AXxxNXxnVEUz7x1vbwkHm5GLYEv04Nf6uKVM=',
            'https://media.istockphoto.com/id/1147034218/photo/wedding-decoration-stage-background.jpg?s=2048x2048&w=is&k=20&c=pob3WfnIqISivRKjoZ4LQabEfKYuYy7-XkOiEFBZqvM=',
            'https://media.istockphoto.com/id/1151796808/photo/gate-of-a-temple-of-india-decorated-by-flower-art-and-craft.jpg?s=612x612&w=0&k=20&c=gk7T-PCqzvMAtxGTSxNALroxc4UwCftAX8W-o03poWE=',
            'https://media.istockphoto.com/id/2153621565/photo/row-of-colorful-flower.jpg?s=612x612&w=0&k=20&c=BUTUtqK631xolDd2K7NCiflhN0FxMc84CM75YGmfIfI=',
            'https://media.istockphoto.com/id/2195940290/photo/indian-wedding-interiors-and-decorations.jpg?s=612x612&w=0&k=20&c=e_HnCNqpBMzlu3PINdm78_PxMUphEV8dLPK2zpYGOTA=',
            'https://media.istockphoto.com/id/1213425026/photo/copper-and-gold-kalash-with-coconut-and-mango-leaf-with-marigold-flower-decoration-at-the.jpg?s=612x612&w=0&k=20&c=ae01DFfxyNifDo9hlc6xkIGhcd_s6mNkgt_CDO0F2G8=',
            'https://media.istockphoto.com/id/1050304980/photo/copper-kalash-with-coconut-leaf-and-floral-decoration-on-a-white-background-essential-in.jpg?s=612x612&w=0&k=20&c=1mxXvUFM3RMs-vI_edYjpLWjSEBuJx6X1mH7kepANng=',
            'https://media.istockphoto.com/id/2173187706/photo/marigolds-and-roses-for-sale-at-an-outdoor-market.jpg?s=612x612&w=0&k=20&c=ls96UgKTQ31-msm-9Era8chBxyVftOC3S4UrT3VCV_o=',
            'https://media.istockphoto.com/id/475536260/photo/religious-offerings-and-oil-lamps-varanasi-uttar-pradesh-india.jpg?s=612x612&w=0&k=20&c=5s_aFdgm_atr_sOtvXghH4VKYVv8lyFCzBHyeaFPd24=',
            'https://media.istockphoto.com/id/1468553370/photo/high-angle-view-of-beautiful-indian-women-in-saris-decorating-rangoli-with-oil-lamps.jpg?s=2048x2048&w=is&k=20&c=Fp6YpK9NJwKTqxyd9mJxZxvvNCzTMqvYnvcvyhMgvk0=',
        ];

        // Anniversary images
        $anniversaryImages = [
            'https://media.istockphoto.com/id/1468559011/photo/beautiful-indian-women-in-saris-decorating-rangoli-with-oil-lamps-sitting-at-the-entrance-of.jpg?s=612x612&w=0&k=20&c=DQMy-yOR5Qs-00gH27pXOYlA_OOLBR5XRjBXR1P49zY=',
            'https://media.istockphoto.com/id/1420020897/photo/traditional-diya-lamps-lit-during-diwali-celebration.jpg?s=612x612&w=0&k=20&c=PNwYHbsNbUToul57fjEmH3qtBgG_ENe622tOCPrhoUs=',
            'https://media.istockphoto.com/id/1477224855/photo/image-of-indian-uruli-bowl-filled-with-pink-orange-and-white-flowers-marigolds-daisies-and.jpg?s=612x612&w=0&k=20&c=Wp6Y0SsbG8Xi22F5y1k00Hz6FHpTdzAyLxRgkit1V4w=',
            'https://media.istockphoto.com/id/1477224862/photo/image-of-indian-uruli-bowl-filled-with-pink-orange-and-white-flowers-daisies-marigolds-and.jpg?s=612x612&w=0&k=20&c=N2XaOMmdc3nirLTe5SnWgdJO--0O_gY4Jwglrgr0NUM=',
            'https://media.istockphoto.com/id/2170933218/photo/image-of-indian-uruli-bowl-filled-with-white-and-orange-flower-heads-frangipani-and-marigold.jpg?s=612x612&w=0&k=20&c=VlKfTOL39TLYPflkZQYlFjuEXANHg4_LZCRGg5mrwOs=',
            'https://media.istockphoto.com/id/484566820/photo/flowers-floating-in-pot-mandalay-myanmar.jpg?s=612x612&w=0&k=20&c=eR6o9wm4gvjaaIVYccX0eivbCKAje2GdISWb-EKbN68=',
            'https://media.istockphoto.com/id/2215570207/photo/a-large-brass-bowl-filled-with-marigold-flowers-in-jaipur-india.jpg?s=612x612&w=0&k=20&c=YgXSvhDKs04bCqchjej8tRPCVXtjotcN9YdWcdzsJIE=',
            'https://media.istockphoto.com/id/1216230300/photo/spring-flower-in-a-container-the-containter-is-usually-filled-with-water-and-colorful-flowers.jpg?s=612x612&w=0&k=20&c=-qiKb-jTTK6S9NnCq_l45G171E1NG9xVcWJGlsjkjLY=',
            'https://media.istockphoto.com/id/1223324885/photo/flowers-in-water-in-a-nepalese-gold-pot.jpg?s=612x612&w=0&k=20&c=QMFPSgnAz3nRq2j5vsoBCyappi8jgMUTsMwQRUAxyTg=',
            'https://media.istockphoto.com/id/2203372258/photo/beautiful-different-original-flowers-in-the-water-photography-while-traveling.jpg?s=612x612&w=0&k=20&c=8GHd5M9NQYuCjFLhNfwybsL34I0SMYyKWgYP1HUMk1k=',
        ];

        // Housewarming images
        $housewarmingImages = [
            'https://media.istockphoto.com/id/1292361152/photo/colorful-floating-flowers-arranged-in-water-bowl.jpg?s=612x612&w=0&k=20&c=-Sr4GLOHYcbpNiI4LfAk7aMPD80xyTej3uLZDJL2g-w=',
            'https://media.istockphoto.com/id/1565554933/photo/flower.jpg?s=612x612&w=0&k=20&c=piiR9EPlhcBoA3XLg5Te8pAH9y7seNdR3gDHjxYellA=',
            'https://media.istockphoto.com/id/485750634/photo/vanilla-flowers-and-stick-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=xFflDNnlljxSFKGq90O-1Y7zqTMNM0zkRjbdOdQ3-HI=',
            'https://media.istockphoto.com/id/487725207/photo/medicinal-neem-leaves-and-flower.jpg?s=2048x2048&w=is&k=20&c=Fkl5S9cvpVphCGGKVRtScMBFsY0amjqPopXSmf4gUw8=',
            'https://media.istockphoto.com/id/942580626/photo/flower-petals-for-puja-ceremony.jpg?s=612x612&w=0&k=20&c=mCusDFwbsEBDrCXWcMxE-VpIYczikzEPtDUgIkKhNs8=',
            'https://media.istockphoto.com/id/1285819665/photo/shiuli-or-night-flowering-jasmine-nyctanthes-arbor-tristis.jpg?s=2048x2048&w=is&k=20&c=ENp6jprsyrLX6q0OjaadzChTmHMCBieAsXKn6l6c47c=',
            'https://media.istockphoto.com/id/1285820442/photo/jasmine-or-parijat-or-hengra-bubar-or-shiuli-flower.jpg?s=612x612&w=0&k=20&c=Mw2cY-YVGLDnvWKuwEgLBe44hu86x5ArWNUbEV_Lv5o=',
            'https://media.istockphoto.com/id/1269462606/photo/jasminum-multiflorum-flowers-bloom-in-the-morning.jpg?s=612x612&w=0&k=20&c=9SPA9zwIUVSAxJAIu-HqfVyjgC_DORPmgxrgI7s-AYQ=',
            'https://media.istockphoto.com/id/669600160/photo/wild-water-plum-flower.jpg?s=612x612&w=0&k=20&c=tzoAMkwdhHLNEmfI866uXZzYG5aYzNn57DsUyukrZys=',
            'https://media.istockphoto.com/id/1176488516/photo/shiuli-flowers-or-night-flowering-jasmine-on-green-leaves.jpg?s=612x612&w=0&k=20&c=JBhly7oyELbTjKjvme2d5wkdy2c-ADXBQQ2YE88-VrM=',
        ];

        // Update wedding occasion with first image
        $wedding = Occasion::where('slug', 'wedding')->first();
        if ($wedding) {
            $wedding->update(['image' => $weddingImages[0]]);
        }

        // Update anniversary occasion with first image
        $anniversary = Occasion::where('slug', 'anniversary')->first();
        if ($anniversary) {
            $anniversary->update(['image' => $anniversaryImages[0]]);
        }

        // Update housewarming occasion with first image
        $housewarming = Occasion::where('slug', 'housewarming')->first();
        if ($housewarming) {
            $housewarming->update(['image' => $housewarmingImages[0]]);
        }

        // Note: The other images can be used for products associated with these occasions
        // This seeder just sets the main image for each occasion
    }
}

