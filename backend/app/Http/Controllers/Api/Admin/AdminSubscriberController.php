<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use App\Models\Coupon;
use App\Models\Setting;
use Illuminate\Http\Request;

class AdminSubscriberController extends Controller
{
    /** List all newsletter subscribers */
    public function indexSubscribers(Request $request)
    {
        $query = Subscriber::with('user:id,name,email')->orderBy('subscribed_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%{$search}%");
            });
        }

        $perPage = (int) $request->get('per_page', 20);
        $subscribers = $query->paginate($perPage);

        return response()->json($subscribers);
    }

    /** List all coupons */
    public function indexCoupons()
    {
        $coupons = Coupon::orderBy('created_at', 'desc')->get();
        return response()->json($coupons);
    }

    /** Create a new coupon */
    public function storeCoupon(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|max:64|unique:coupons,code',
            'description' => 'nullable|string|max:255',
            'discount_type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'min_order' => 'nullable|numeric|min:0',
            'for_subscribers_only' => 'boolean',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
        ]);

        if ($data['discount_type'] === 'percent' && isset($data['value']) && $data['value'] > 100) {
            return response()->json(['error' => 'Percent discount cannot exceed 100.'], 422);
        }

        $data['for_subscribers_only'] = $data['for_subscribers_only'] ?? false;
        $data['is_active'] = $data['is_active'] ?? true;

        $coupon = Coupon::create($data);
        return response()->json($coupon, 201);
    }

    /** Update a coupon */
    public function updateCoupon(Request $request, int $id)
    {
        $coupon = Coupon::findOrFail($id);

        $data = $request->validate([
            'code' => 'sometimes|string|max:64|unique:coupons,code,' . $id,
            'description' => 'nullable|string|max:255',
            'discount_type' => 'sometimes|in:percent,fixed',
            'value' => 'sometimes|numeric|min:0',
            'min_order' => 'nullable|numeric|min:0',
            'for_subscribers_only' => 'boolean',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date',
            'usage_limit' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        if (isset($data['discount_type']) && $data['discount_type'] === 'percent' && isset($data['value']) && $data['value'] > 100) {
            return response()->json(['error' => 'Percent discount cannot exceed 100.'], 422);
        }

        $coupon->update($data);
        return response()->json($coupon);
    }

    /** Delete a coupon */
    public function destroyCoupon(int $id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->delete();
        return response()->json(['message' => 'Coupon deleted']);
    }

    /** Get subscriber benefits (special features for subscribers) */
    public function getSubscriberBenefits()
    {
        $benefits = Setting::get('subscriber_benefits', []);
        if (!is_array($benefits)) {
            $benefits = [];
        }
        return response()->json(['benefits' => $benefits]);
    }

    /** Update subscriber benefits (list of special features/offers for subscribers) */
    public function updateSubscriberBenefits(Request $request)
    {
        $request->validate([
            'benefits' => 'required|array',
            'benefits.*.title' => 'required|string|max:255',
            'benefits.*.description' => 'nullable|string|max:1000',
        ]);

        $benefits = $request->benefits;
        Setting::set('subscriber_benefits', $benefits);

        return response()->json(['message' => 'Subscriber benefits updated', 'benefits' => $benefits]);
    }
}
