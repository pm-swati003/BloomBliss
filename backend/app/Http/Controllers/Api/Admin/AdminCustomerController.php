<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminCustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('is_admin', false)
            ->withCount('orders')
            ->withSum(['orders as total_spent' => function ($q) {
                $q->whereIn('status', ['shipped', 'delivered']);
            }], 'total');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'name');
        if ($sortBy === 'orders') {
            $query->orderByDesc('orders_count');
        } elseif ($sortBy === 'spent') {
            $query->orderByDesc('total_spent');
        } elseif ($sortBy === 'date') {
            $query->orderByDesc('created_at');
        } else {
            $query->orderBy('name');
        }

        $perPage = (int) $request->get('per_page', 15);
        $users = $query->paginate($perPage);

        $items = $users->getCollection()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'location' => '—',
                'orders' => $user->orders_count ?? 0,
                'total_spent' => (float) ($user->total_spent ?? 0),
                'join_date' => $user->created_at->format('Y-m-d'),
                'status' => 'Active',
            ];
        });
        $users->setCollection($items);

        return response()->json($users);
    }

}
