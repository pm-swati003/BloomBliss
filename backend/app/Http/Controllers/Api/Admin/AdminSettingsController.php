<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class AdminSettingsController extends Controller
{
    public function index()
    {
        return response()->json([
            'general' => Setting::get('general', $this->defaultGeneral()),
            'notifications' => Setting::get('notifications', $this->defaultNotifications()),
            'security' => Setting::get('security', $this->defaultSecurity()),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'general' => 'sometimes|array',
            'general.siteName' => 'sometimes|string|max:255',
            'general.siteEmail' => 'sometimes|email',
            'general.supportEmail' => 'sometimes|email',
            'general.phone' => 'sometimes|string|max:50',
            'general.address' => 'sometimes|string',
            'general.shop_lat' => 'sometimes|nullable|numeric',
            'general.shop_lng' => 'sometimes|nullable|numeric',
            'general.currency' => 'sometimes|string|max:10',
            'general.timezone' => 'sometimes|string|max:50',
            'general.language' => 'sometimes|string|max:10',
            'general.deliveryRatePerKm' => 'sometimes|numeric|min:0',
            'notifications' => 'sometimes|array',
            'security' => 'sometimes|array',
        ]);

        if ($request->has('general')) {
            $general = array_merge($this->defaultGeneral(), $request->input('general', []));
            Setting::set('general', $general);
        }
        if ($request->has('notifications')) {
            $notifications = array_merge($this->defaultNotifications(), $request->input('notifications', []));
            Setting::set('notifications', $notifications);
        }
        if ($request->has('security')) {
            $security = array_merge($this->defaultSecurity(), $request->input('security', []));
            Setting::set('security', $security);
        }

        return response()->json(['message' => 'Settings saved']);
    }

    private function defaultGeneral(): array
    {
        return [
            'siteName' => 'Bloom & Bliss',
            'siteEmail' => 'admin@bloomandbliss.com',
            'supportEmail' => 'support@bloomandbliss.com',
            'phone' => '+1 (415) 555-0100',
            'address' => '123 Flower Street, San Francisco, CA 94102',
            'shop_lat' => null,
            'shop_lng' => null,
            'currency' => 'INR',
            'timezone' => 'Asia/Kolkata',
            'language' => 'en',
            'deliveryRatePerKm' => 30,
        ];
    }

    private function defaultNotifications(): array
    {
        return [
            'newOrders' => true,
            'lowStock' => true,
            'newCustomers' => true,
            'customerReviews' => true,
            'systemUpdates' => false,
        ];
    }

    private function defaultSecurity(): array
    {
        return [
            'twoFactor' => false,
            'sessionTimeout' => '30',
            'passwordExpiry' => '90',
        ];
    }
}
