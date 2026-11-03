<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Setting;
use App\Models\Subscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    /** Public: get subscriber benefits (special features for subscribers) */
    public function benefits()
    {
        $benefits = Setting::get('subscriber_benefits', []);
        return response()->json(['benefits' => is_array($benefits) ? $benefits : []]);
    }

    /** Authenticated: get current user's subscriber perks (benefits + coupon codes they can use) */
    public function myPerks(Request $request)
    {
        $user = $request->user();
        $email = $user ? trim(strtolower($user->email)) : null;
        $isSubscriber = $email && Subscriber::isSubscribed($email);

        $benefits = [];
        $coupons = [];

        if ($isSubscriber) {
            $benefits = Setting::get('subscriber_benefits', []);
            $benefits = is_array($benefits) ? $benefits : [];

            $subscriberCoupons = Coupon::where('for_subscribers_only', true)
                ->where('is_active', true)
                ->orderBy('code')
                ->get();

            foreach ($subscriberCoupons as $coupon) {
                if ($coupon->isValid($email)) {
                    $coupons[] = [
                        'code' => $coupon->code,
                        'description' => $coupon->description,
                        'discount_type' => $coupon->discount_type,
                        'value' => (float) $coupon->value,
                        'min_order' => $coupon->min_order ? (float) $coupon->min_order : null,
                        'valid_until' => $coupon->valid_until?->toIso8601String(),
                    ];
                }
            }
        }

        return response()->json([
            'is_subscriber' => $isSubscriber,
            'benefits' => $benefits,
            'coupons' => $coupons,
        ]);
    }

    /** Public: subscribe email to floral updates */
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = trim(strtolower($request->email));
        $user = $request->user(); // optional: may be guest

        $subscriber = Subscriber::firstOrCreate(
            ['email' => $email],
            [
                'user_id' => $user?->id,
                'subscribed_at' => now(),
            ]
        );

        if (!$subscriber->wasRecentlyCreated) {
            return response()->json([
                'message' => 'You are already subscribed.',
                'subscribed' => true,
            ], 200);
        }

        return response()->json([
            'message' => 'Thank you for subscribing! You will receive exclusive offers and flower care tips.',
            'subscribed' => true,
        ], 201);
    }
}
