<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Notification;
use App\Models\Setting;
use App\Models\DeliveryProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DeliveryController extends Controller
{
    /**
     * Update delivery partner profile. Required: name, phone. Marks profile_completed when both are set.
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|nullable|string|max:50',
            'birthday' => 'sometimes|nullable|date',
            'vehicle_type' => 'sometimes|nullable|string',
            'vehicle_model' => 'sometimes|nullable|string',
            'license_plate' => 'sometimes|nullable|string',
            'document' => 'sometimes|nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'vehicle_photo' => 'sometimes|nullable|file|mimes:jpg,jpeg,png|max:5120',
            'profile_photo' => 'sometimes|nullable|file|mimes:jpg,jpeg,png|max:5120',
            'id_proof' => 'sometimes|nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $user = auth()->user();
        $updateData = [];
        if ($request->has('name')) {
            $updateData['name'] = trim((string) $request->name);
        }
        if ($request->has('phone')) {
            $v = $request->phone;
            $updateData['phone'] = ($v !== null && $v !== '') ? trim((string) $v) : null;
        }
        if ($request->has('birthday')) {
            $updateData['birthday'] = $request->birthday ? $request->date('birthday') : null;
        }
        if ($updateData !== []) {
            $user->update($updateData);
        }

        $profile = DeliveryProfile::firstOrCreate(['user_id' => $user->id]);
        $profileData = $request->only(['vehicle_type', 'vehicle_model', 'license_plate', 'license_number']);
        
        if ($request->hasFile('document')) {
            if ($profile->document_path) Storage::disk('public')->delete($profile->document_path);
            $profileData['document_path'] = $request->file('document')->store('delivery_documents', 'public');
        }
        if ($request->hasFile('vehicle_photo')) {
            if ($profile->vehicle_photo_path) Storage::disk('public')->delete($profile->vehicle_photo_path);
            $profileData['vehicle_photo_path'] = $request->file('vehicle_photo')->store('delivery_photos', 'public');
        }
        if ($request->hasFile('profile_photo')) {
            if ($profile->profile_photo_path) Storage::disk('public')->delete($profile->profile_photo_path);
            $profileData['profile_photo_path'] = $request->file('profile_photo')->store('delivery_photos', 'public');
        }
        if ($request->hasFile('id_proof')) {
            if ($profile->id_proof_path) Storage::disk('public')->delete($profile->id_proof_path);
            $profileData['id_proof_path'] = $request->file('id_proof')->store('delivery_documents', 'public');
        }
        
        $profile->update($profileData);

        $user->refresh();
        $nameOk = $user->name && trim($user->name) !== '';
        $phoneOk = $user->phone && trim($user->phone) !== '';
        // Also check if vehicle details exist
        $vehicleOk = $profile->vehicle_type && $profile->license_plate;
        
        $user->update(['profile_completed' => $nameOk && $phoneOk && $vehicleOk]);

        return response()->json([
            'user' => $user->fresh(),
            'profile' => $profile->fresh(),
            'profile_completed' => $user->fresh()->profile_completed,
        ]);
    }
    /**
     * List orders available for delivery: shipped (out for delivery) and optionally processing (ready to pick).
     */
    public function orders(Request $request)
    {
        $status = $request->get('status'); // 'active' = shipped, 'delivered' = delivered, null = all for delivery
        $query = Order::with(['user:id,name,email,phone', 'items.product:id,name', 'shippingAddress'])
            ->orderByRaw("CASE status WHEN 'shipped' THEN 0 WHEN 'processing' THEN 1 ELSE 2 END")
            ->orderBy('delivery_date')
            ->orderBy('delivery_time');

        if ($status === 'active') {
            $query->whereIn('status', ['shipped', 'processing']);
        } elseif ($status === 'delivered') {
            $query->where('status', 'delivered')
                  ->where('rider_user_id', auth()->id())
                  ->orderBy('updated_at', 'desc');
        } else {
            $query->whereIn('status', ['shipped', 'processing']);
        }

        $orders = $query->get()->map(function ($order) {
            $firstItem = $order->items->first();
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'total' => (float) $order->total,
                'delivery_date' => $order->delivery_date?->format('Y-m-d'),
                'delivery_time' => $order->delivery_time,
                'customer_name' => $order->user?->name,
                'customer_phone' => $order->user?->phone ?? $order->shippingAddress?->phone ?? null,
                'product_summary' => $firstItem ? $firstItem->product_name . ($order->items->count() > 1 ? ' +' . ($order->items->count() - 1) : '') : '—',
                'address' => $order->shippingAddress ? [
                    'street' => $order->shippingAddress->street,
                    'city' => $order->shippingAddress->city,
                    'state' => $order->shippingAddress->state,
                    'zip' => $order->shippingAddress->zip,
                    'full' => implode(', ', array_filter([
                        $order->shippingAddress->street,
                        $order->shippingAddress->city,
                        $order->shippingAddress->state,
                        $order->shippingAddress->zip,
                    ])),
                ] : null,
                'rider_lat' => $order->rider_lat ? (float) $order->rider_lat : null,
                'rider_lng' => $order->rider_lng ? (float) $order->rider_lng : null,
                'estimated_delivery_at' => $order->estimated_delivery_at?->toIso8601String(),
            ];
        });

        return response()->json($orders);
    }

    /**
     * Stats for dashboard: today's counts and earnings placeholder.
     */
    public function stats()
    {
        $today = now()->toDateString();
        $riderId = auth()->id();
        
        $totalDeliveries = Order::where('rider_user_id', $riderId)->where('status', 'delivered')->count();
        $completedToday = Order::where('rider_user_id', $riderId)->where('status', 'delivered')->whereDate('updated_at', $today)->count();
        $pending = Order::whereIn('status', ['shipped', 'processing'])->count(); // Still available for all riders
        $deliveredTotal = Order::where('rider_user_id', $riderId)->where('status', 'delivered')->whereDate('updated_at', $today)->count();
        
        // Calculate earnings for the current rider
        $riderId = auth()->id();
        $totalEarnings = Order::where('rider_user_id', $riderId)->where('status', 'delivered')->sum('delivery_earnings') ?? 0;
        $todayEarnings = Order::where('rider_user_id', $riderId)->where('status', 'delivered')->whereDate('updated_at', $today)->sum('delivery_earnings') ?? 0;

        return response()->json([
            'total_deliveries' => $totalDeliveries,
            'completed_today' => $completedToday,
            'pending' => $pending,
            'delivered_today' => $deliveredTotal,
            'total_earnings' => $totalEarnings,
            'today_earnings' => $todayEarnings,
        ]);
    }

    /**
     * Update rider location for an order (same as admin tracking update).
     */
    public function updateLocation(Request $request, int $id)
    {
        $request->validate([
            'rider_lat' => 'required|numeric|between:-90,90',
            'rider_lng' => 'required|numeric|between:-180,180',
            'estimated_delivery_at' => 'nullable|date',
        ]);
        $order = Order::whereIn('status', ['shipped', 'processing'])->findOrFail($id);
        $order->update([
            'rider_lat' => $request->rider_lat,
            'rider_lng' => $request->rider_lng,
            'rider_user_id' => auth()->id(),
            'estimated_delivery_at' => $request->estimated_delivery_at ? now()->parse($request->estimated_delivery_at) : $order->estimated_delivery_at,
        ]);
        return response()->json($order->fresh());
    }

    /**
     * Mark order as delivered (sets status to delivered and triggers geocoding etc. like admin).
     */
    public function markDelivered(Request $request, int $id)
    {
        $order = Order::with('shippingAddress')->whereIn('status', ['shipped', 'processing'])->findOrFail($id);
        
        $generalSettings = Setting::get('general', []);
        
        // Use Shop location from settings or fallback to default coordinates
        $shopLat = $generalSettings['shop_lat'] ?? 15.8497;
        $shopLng = $generalSettings['shop_lng'] ?? 74.4977;
        
        // Dest location from order, or try to use rider's last tracked location
        $destLat = $order->delivery_lat ?? $order->rider_lat ?? null;
        $destLng = $order->delivery_lng ?? $order->rider_lng ?? null;

        $distance = 5; // Default distance if coordinates are missing
        if ($destLat && $destLng && $shopLat && $shopLng) {
            $distance = $this->calculateDistance($shopLat, $shopLng, $destLat, $destLng);
        }

        // Frontend might pass routing distance, but we enforce at least the straight-line distance
        $frontendDistance = (float)$request->input('distance_km', 0);
        if ($frontendDistance > $distance) {
            $distance = $frontendDistance;
        }
        
        $ratePerKm = $generalSettings['deliveryRatePerKm'] ?? 30;
        $earnings = round($distance * $ratePerKm, 2);

        $order->update([
            'status' => 'delivered', 
            'rider_user_id' => $order->rider_user_id ?? auth()->id(),
            'distance_km' => round($distance, 2),
            'delivery_earnings' => $earnings,
        ]);

        if ($order->shippingAddress) {
            try {
                $coords = $this->geocodeAddress(
                    $order->shippingAddress->street,
                    $order->shippingAddress->city,
                    $order->shippingAddress->state,
                    $order->shippingAddress->zip
                );
                if ($coords) {
                    $order->update(['delivery_lat' => $coords['lat'], 'delivery_lng' => $coords['lng']]);
                }
            } catch (\Throwable $e) {
                report($e);
            }
        }

        Notification::create([
            'user_id' => $order->user_id,
            'type' => 'order_status',
            'title' => 'Order ' . $order->order_number,
            'body' => 'Order delivered',
            'data' => ['order_id' => $order->id, 'order_number' => $order->order_number, 'status' => 'delivered'],
        ]);
        Notification::create([
            'user_id' => $order->user_id,
            'type' => 'review_request',
            'title' => 'How was your order?',
            'body' => 'Share your experience!',
            'data' => ['order_id' => $order->id, 'order_number' => $order->order_number],
        ]);

        return response()->json($order->fresh(['user', 'items.product', 'shippingAddress']));
    }

    private function geocodeAddress(?string $street, ?string $city, ?string $state, ?string $zip): ?array
    {
        $parts = array_filter([$street, $city, $state, $zip], fn ($v) => $v !== null && $v !== '');
        if (empty($parts)) return null;
        $response = \Illuminate\Support\Facades\Http::withHeaders([
            'Accept' => 'application/json',
            'User-Agent' => 'BloomFlowerApp/1.0',
        ])->timeout(5)->get('https://nominatim.openstreetmap.org/search', [
            'q' => implode(', ', $parts),
            'format' => 'json',
            'limit' => 1,
        ]);
        if (!$response->successful()) return null;
        $data = $response->json();
        if (!is_array($data) || empty($data)) return null;
        $lat = isset($data[0]['lat']) ? (float) $data[0]['lat'] : null;
        $lon = isset($data[0]['lon']) ? (float) $data[0]['lon'] : null;
        return ($lat !== null && $lon !== null) ? ['lat' => $lat, 'lng' => $lon] : null;
    }

    /**
     * Calculate the Haversine distance between two coordinates in km.
     */
    private function calculateDistance($lat1, $lon1, $lat2, $lon2): float
    {
        $earthRadius = 6371; // km
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        
        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);
             
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        $distance = $earthRadius * $c;
        
        // Minimum distance is 1km
        return max(1, $distance);
    }
}
