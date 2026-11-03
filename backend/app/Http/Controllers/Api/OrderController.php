<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Setting;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Notification;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['items.product', 'shippingAddress', 'paymentMethod'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        $userId = auth()->id();
        $reviewedProductIds = Review::where('user_id', $userId)->pluck('product_id')->flip();

        $orders->transform(function ($order) use ($reviewedProductIds) {
            if ($order->items) {
                foreach ($order->items as $item) {
                    $item->has_review = $reviewedProductIds->has($item->product_id);
                }
            }
            return $order;
        });

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipping_address_id' => 'required|exists:addresses,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'delivery_date' => 'required|date',
            'delivery_time' => 'required|string',
            'coupon_code' => 'nullable|string|max:64',
        ]);

        $cartItems = CartItem::with('product')
            ->where('user_id', auth()->id())
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }

        // Check stock before placing order
        foreach ($cartItems as $cartItem) {
            $product = $cartItem->product;
            if (!$product || $product->stock < $cartItem->quantity) {
                $name = $product->name ?? 'Product';
                return response()->json([
                    'error' => 'Insufficient stock.',
                    'message' => "{$name} has only " . ($product->stock ?? 0) . ' in stock. Please reduce quantity or remove from cart.',
                ], 400);
            }
        }

        $subtotal = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        $shipping = $subtotal >= 100 ? 0 : 9.99;
        $discount = 0;
        $couponId = null;
        $userEmail = auth()->user()->email ?? null;

        if ($request->filled('coupon_code')) {
            $coupon = Coupon::where('code', trim($request->coupon_code))->first();
            if ($coupon && $coupon->isValid($userEmail)) {
                $discount = $coupon->applyDiscount($subtotal);
                $couponId = $coupon->id;
            }
        }

        $total = max(0, $subtotal + $shipping - $discount);

        $order = null;
        DB::transaction(function () use ($cartItems, $request, $subtotal, $shipping, $discount, $total, $couponId, &$order) {
            $order = Order::create([
                'user_id' => auth()->id(),
                'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'discount' => $discount,
                'total' => $total,
                'status' => 'pending',
                'tracking_number' => 'TRK' . strtoupper(Str::random(9)),
                'shipping_address_id' => $request->shipping_address_id,
                'payment_method_id' => $request->payment_method_id,
                'coupon_id' => $couponId,
                'delivery_date' => $request->delivery_date,
                'delivery_time' => $request->delivery_time,
            ]);

            if ($couponId) {
                Coupon::where('id', $couponId)->increment('used_count');
            }

            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'product_name' => $cartItem->product->name,
                    'price' => $cartItem->product->price,
                    'quantity' => $cartItem->quantity,
                    'size' => $cartItem->size,
                    'occasion' => $cartItem->occasion,
                ]);
                // Decrease product stock when order is placed
                Product::where('id', $cartItem->product_id)->decrement('stock', $cartItem->quantity);
            }

            // Clear cart
            CartItem::where('user_id', auth()->id())->delete();
        });

        // Notify customer: order placed
        Notification::create([
            'user_id' => auth()->id(),
            'type' => 'order_status',
            'title' => 'Order ' . $order->order_number,
            'body' => 'Your order has been confirmed and is being processed.',
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'status' => 'pending',
            ],
        ]);

        return response()->json($order->load(['items.product', 'shippingAddress', 'paymentMethod'])->fresh(), 201);
    }

    public function show($id)
    {
        $order = Order::with(['items.product', 'shippingAddress', 'paymentMethod'])
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        $reviewedProductIds = Review::where('user_id', auth()->id())
            ->whereIn('product_id', $order->items->pluck('product_id'))
            ->pluck('product_id')
            ->flip();

        foreach ($order->items as $item) {
            $item->has_review = $reviewedProductIds->has($item->product_id);
        }

        return response()->json($order);
    }

    /** Live tracking for customer: steps, rider location, ETA, rider details */
    public function tracking($id)
    {
        $order = Order::with(['shippingAddress', 'rider:id,name,phone,delivery_rating'])
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        $steps = [
            ['key' => 'pending', 'label' => 'Order placed', 'done' => true],
            ['key' => 'processing', 'label' => 'Preparing order', 'done' => in_array($order->status, ['processing', 'shipped', 'delivered'])],
            ['key' => 'shipped', 'label' => 'Out for delivery', 'done' => in_array($order->status, ['shipped', 'delivered'])],
            ['key' => 'delivered', 'label' => 'Delivered', 'done' => $order->status === 'delivered'],
        ];
        $statusOrder = ['pending' => 0, 'processing' => 1, 'shipped' => 2, 'delivered' => 3, 'cancelled' => -1];
        $currentIndex = isset($statusOrder[$order->status]) ? $statusOrder[$order->status] : 0;
        if ($currentIndex < 0) {
            $currentIndex = 0;
        }

        $riderLat = $order->rider_lat ? (float) $order->rider_lat : null;
        $riderLng = $order->rider_lng ? (float) $order->rider_lng : null;
        $estimatedAt = $order->estimated_delivery_at?->toIso8601String();

        $general = Setting::get('general', []);
        $shopAddress = $general['address'] ?? null;
        $shopLat = isset($general['shop_lat']) ? (float) $general['shop_lat'] : null;
        $shopLng = isset($general['shop_lng']) ? (float) $general['shop_lng'] : null;

        $rider = $order->rider ? [
            'id' => $order->rider->id,
            'name' => $order->rider->name,
            'phone' => $order->rider->phone ?? null,
            'rating' => $order->rider->delivery_rating !== null ? (float) $order->rider->delivery_rating : null,
        ] : null;

        return response()->json([
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'steps' => $steps,
            'current_step_index' => $currentIndex,
            'rider_lat' => $riderLat,
            'rider_lng' => $riderLng,
            'rider' => $rider,
            'estimated_delivery_at' => $estimatedAt,
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
}
