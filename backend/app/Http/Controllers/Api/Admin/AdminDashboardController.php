<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function stats()
    {
        $totalRevenue = Order::whereIn('status', ['shipped', 'delivered'])->sum('total');
        $ordersCount = Order::count();
        $customersCount = User::where('is_admin', false)->count();
        $productsCount = Product::count();

        $previousMonthStart = now()->subMonth()->startOfMonth();
        $previousMonthEnd = now()->subMonth()->endOfMonth();
        $currentMonthStart = now()->startOfMonth();
        $previousRevenue = Order::whereIn('status', ['shipped', 'delivered'])
            ->whereBetween('created_at', [$previousMonthStart, $previousMonthEnd])
            ->sum('total');
        $currentRevenue = Order::whereIn('status', ['shipped', 'delivered'])
            ->where('created_at', '>=', $currentMonthStart)
            ->sum('total');
        $revenueChange = $previousRevenue > 0
            ? round((($currentRevenue - $previousRevenue) / $previousRevenue) * 100, 1)
            : 0;

        $previousOrders = Order::whereBetween('created_at', [$previousMonthStart, $previousMonthEnd])->count();
        $currentOrders = Order::where('created_at', '>=', $currentMonthStart)->count();
        $ordersChange = $previousOrders > 0
            ? round((($currentOrders - $previousOrders) / $previousOrders) * 100, 1)
            : 0;

        return response()->json([
            'total_revenue' => (float) $totalRevenue,
            'orders_count' => $ordersCount,
            'customers_count' => $customersCount,
            'products_count' => $productsCount,
            'revenue_change' => $revenueChange,
            'orders_change' => $ordersChange,
        ]);
    }

    public function recentOrders()
    {
        $orders = Order::with(['user', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json($orders->map(function ($order) {
            $firstItem = $order->items->first();
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer' => $order->user?->name ?? 'N/A',
                'product' => $firstItem?->product_name ?? 'N/A',
                'amount' => (float) $order->total,
                'status' => $order->status,
                'date' => $order->created_at->format('Y-m-d'),
                'delivery_date' => $order->delivery_date?->format('Y-m-d'),
                'delivery_time' => $order->delivery_time,
            ];
        }));
    }

    /** Orders that must be delivered today (not yet delivered/cancelled) – for handler alerts */
    public function deliveriesDueToday()
    {
        $today = now()->toDateString();
        $orders = Order::with(['user', 'items.product'])
            ->where('delivery_date', $today)
            ->whereNotIn('status', ['delivered', 'cancelled'])
            ->orderBy('delivery_time')
            ->get();

        return response()->json($orders->map(function ($order) {
            $firstItem = $order->items->first();
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer' => $order->user?->name ?? 'N/A',
                'delivery_date' => $order->delivery_date?->format('Y-m-d'),
                'delivery_time' => $order->delivery_time ?? '—',
                'status' => $order->status,
                'product' => $firstItem?->product_name ?? 'N/A',
            ];
        }));
    }

    public function lowStock(Request $request)
    {
        $threshold = (int) $request->get('threshold', 20);
        $products = Product::where('stock', '<=', $threshold)
            ->where('stock', '>=', 0)
            ->orderBy('stock')
            ->limit(10)
            ->get(['id', 'name', 'stock']);

        return response()->json($products->map(function ($p) use ($threshold) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'stock' => $p->stock,
                'threshold' => $threshold,
            ];
        }));
    }
}
