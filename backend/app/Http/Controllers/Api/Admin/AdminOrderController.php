<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'rider:id,name,email,phone,delivery_rating', 'items.product', 'shippingAddress', 'paymentMethod'])
            ->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('items', function ($iq) use ($search) {
                        $iq->where('product_name', 'like', "%{$search}%");
                    });
            });
        }

        $perPage = (int) $request->get('per_page', 15);
        $orders = $query->paginate($perPage);

        return response()->json($orders);
    }

    public function show(int $id)
    {
        $order = Order::with(['user', 'rider:id,name,email,phone,delivery_rating', 'items.product', 'shippingAddress', 'paymentMethod'])->findOrFail($id);
        return response()->json($order);
    }

    /** Live tracking for admin: same shape as customer tracking so admin can see rider live location and rider details */
    public function tracking(int $id)
    {
        $order = Order::with(['shippingAddress', 'rider:id,name,phone,delivery_rating'])
            ->findOrFail($id);

        $steps = [
            ['key' => 'pending', 'label' => 'Order placed', 'done' => true],
            ['key' => 'processing', 'label' => 'Preparing order', 'done' => in_array($order->status, ['processing', 'shipped', 'delivered'])],
            ['key' => 'shipped', 'label' => 'Out for delivery', 'done' => in_array($order->status, ['shipped', 'delivered'])],
            ['key' => 'delivered', 'label' => 'Delivered', 'done' => $order->status === 'delivered'],
        ];
        $statusOrder = ['pending' => 0, 'processing' => 1, 'shipped' => 2, 'delivered' => 3, 'cancelled' => -1];
        $currentIndex = isset($statusOrder[$order->status]) ? $statusOrder[$order->status] : 0;
        if ($currentIndex < 0) $currentIndex = 0;

        $riderLat = $order->rider_lat ? (float) $order->rider_lat : null;
        $riderLng = $order->rider_lng ? (float) $order->rider_lng : null;
        $rider = $order->rider ? [
            'id' => $order->rider->id,
            'name' => $order->rider->name,
            'phone' => $order->rider->phone ?? null,
            'rating' => $order->rider->delivery_rating !== null ? (float) $order->rider->delivery_rating : null,
        ] : null;

        $general = \App\Models\Setting::get('general', []);
        $shopAddress = $general['address'] ?? null;
        $shopLat = isset($general['shop_lat']) ? (float) $general['shop_lat'] : null;
        $shopLng = isset($general['shop_lng']) ? (float) $general['shop_lng'] : null;

        return response()->json([
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'steps' => $steps,
            'current_step_index' => $currentIndex,
            'rider_lat' => $riderLat,
            'rider_lng' => $riderLng,
            'rider' => $rider,
            'estimated_delivery_at' => $order->estimated_delivery_at?->toIso8601String(),
            'shop_address' => is_string($shopAddress) ? $shopAddress : null,
            'shop_lat' => $shopLat,
            'shop_lng' => $shopLng,
            'delivery_address' => $order->shippingAddress ? [
                'street' => $order->shippingAddress->street,
                'city' => $order->shippingAddress->city,
                'state' => $order->shippingAddress->state,
                'zip' => $order->shippingAddress->zip,
            ] : null,
            'delivery_lat' => $order->delivery_lat ? (float) $order->delivery_lat : null,
            'delivery_lng' => $order->delivery_lng ? (float) $order->delivery_lng : null,
            'delivery_date' => $order->delivery_date?->format('Y-m-d'),
            'delivery_time' => $order->delivery_time,
        ]);
    }

    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);
        $order = Order::with(['items', 'shippingAddress'])->findOrFail($id);
        $previousStatus = $order->status;
        $order->update(['status' => $request->status]);
        $newStatus = $request->status;

        // When status is set to delivered, geocode shipping address and save destination lat/lng (only for this status).
        // Wrapped in try-catch so status update always succeeds even if geocoding fails (e.g. network timeout).
        if ($newStatus === 'delivered' && $order->shippingAddress) {
            try {
                $coords = $this->geocodeAddress(
                    $order->shippingAddress->street,
                    $order->shippingAddress->city,
                    $order->shippingAddress->state,
                    $order->shippingAddress->zip
                );
                if ($coords) {
                    $order->update([
                        'delivery_lat' => $coords['lat'],
                        'delivery_lng' => $coords['lng'],
                    ]);
                }
            } catch (\Throwable $e) {
                // Log but do not fail the request; status is already updated to delivered
                report($e);
            }
        }

        // When order is cancelled, restore product stock
        if ($newStatus === 'cancelled' && $previousStatus !== 'cancelled') {
            foreach ($order->items as $item) {
                Product::where('id', $item->product_id)->increment('stock', $item->quantity);
            }
        }

        // Notify customer of delivery step (each status change)
        $statusLabels = [
            'pending' => 'Order confirmed',
            'processing' => 'Order is being processed',
            'shipped' => 'Order has been shipped',
            'delivered' => 'Order delivered',
            'cancelled' => 'Order cancelled',
        ];
        $title = 'Order ' . $order->order_number;
        $body = 'Your order status: ' . ($statusLabels[$newStatus] ?? $newStatus);
        Notification::create([
            'user_id' => $order->user_id,
            'type' => 'order_status',
            'title' => $title,
            'body' => $body,
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $newStatus,
            ],
        ]);

        // When delivered, ask for review
        if ($newStatus === 'delivered') {
            Notification::create([
                'user_id' => $order->user_id,
                'type' => 'review_request',
                'title' => 'How was your order?',
                'body' => 'Share your experience! Your review helps other customers.',
                'data' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                ],
            ]);
        }

        return response()->json($order->fresh(['user', 'items.product', 'shippingAddress', 'paymentMethod']));
    }

    /** Update rider live location and ETA (for admin/driver app) */
    public function updateTracking(Request $request, int $id)
    {
        $request->validate([
            'rider_lat' => 'nullable|numeric|between:-90,90',
            'rider_lng' => 'nullable|numeric|between:-180,180',
            'estimated_delivery_at' => 'nullable|date',
        ]);
        $order = Order::findOrFail($id);
        $updates = [];
        if ($request->has('rider_lat')) {
            $updates['rider_lat'] = $request->rider_lat;
        }
        if ($request->has('rider_lng')) {
            $updates['rider_lng'] = $request->rider_lng;
        }
        if ($request->has('estimated_delivery_at')) {
            $updates['estimated_delivery_at'] = $request->estimated_delivery_at;
        }
        $order->update($updates);
        return response()->json($order->fresh());
    }

    /**
     * Geocode an address using Nominatim (OpenStreetMap). Returns ['lat' => float, 'lng' => float] or null.
     */
    private function geocodeAddress(?string $street, ?string $city, ?string $state, ?string $zip): ?array
    {
        $parts = array_filter([$street, $city, $state, $zip], fn ($v) => $v !== null && $v !== '');
        if (empty($parts)) {
            return null;
        }
        $query = implode(', ', $parts);
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'User-Agent' => 'BloomFlowerApp/1.0',
        ])->timeout(5)->get('https://nominatim.openstreetmap.org/search', [
            'q' => $query,
            'format' => 'json',
            'limit' => 1,
        ]);

        if (!$response->successful()) {
            return null;
        }
        $data = $response->json();
        if (!is_array($data) || empty($data)) {
            return null;
        }
        $lat = isset($data[0]['lat']) ? (float) $data[0]['lat'] : null;
        $lon = isset($data[0]['lon']) ? (float) $data[0]['lon'] : null;
        if ($lat === null || $lon === null) {
            return null;
        }
        return ['lat' => $lat, 'lng' => $lon];
    }
}
