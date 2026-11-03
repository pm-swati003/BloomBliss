<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /** Validate coupon code (optional: subscriber email for subscriber-only coupons) */
    public function validate(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:64',
            'email' => 'nullable|email',
            'subtotal' => 'nullable|numeric|min:0',
        ]);

        $code = trim($request->code);
        $email = $request->email ? trim(strtolower($request->email)) : null;
        $subtotal = (float) ($request->subtotal ?? 0);

        // Case-insensitive coupon lookup (e.g. "flower10" matches "FLOWER10")
        $coupon = Coupon::whereRaw('LOWER(code) = ?', [strtolower($code)])->first();

        if (!$coupon) {
            return response()->json(['valid' => false, 'message' => 'Invalid coupon code.'], 422);
        }

        if (!$coupon->isValid($email)) {
            if ($coupon->for_subscribers_only && (!$email || !\App\Models\Subscriber::isSubscribed($email))) {
                return response()->json(['valid' => false, 'message' => 'This offer is for subscribers only. Subscribe to our newsletter to use it.'], 422);
            }
            if ($coupon->valid_until && now()->gt($coupon->valid_until)) {
                return response()->json(['valid' => false, 'message' => 'This coupon has expired.'], 422);
            }
            if ($coupon->usage_limit !== null && $coupon->used_count >= $coupon->usage_limit) {
                return response()->json(['valid' => false, 'message' => 'This coupon has reached its usage limit.'], 422);
            }
            return response()->json(['valid' => false, 'message' => 'This coupon is not valid.'], 422);
        }

        $discount = $coupon->applyDiscount($subtotal);
        $minOrder = $coupon->min_order ? (float) $coupon->min_order : null;

        // Coupon valid but minimum order not met
        if ($minOrder !== null && $subtotal < $minOrder) {
            return response()->json([
                'valid' => false,
                'message' => 'Minimum order of ₹' . number_format($minOrder, 0) . ' required for this coupon.',
            ], 422);
        }

        return response()->json([
            'valid' => true,
            'coupon_id' => $coupon->id,
            'code' => $coupon->code,
            'description' => $coupon->description,
            'discount_type' => $coupon->discount_type,
            'value' => (float) $coupon->value,
            'min_order' => $minOrder,
            'discount_amount' => $discount,
            'message' => $coupon->discount_type === 'percent'
                ? $coupon->value . '% off'
                : '₹' . number_format($coupon->value, 2) . ' off',
        ]);
    }
}
