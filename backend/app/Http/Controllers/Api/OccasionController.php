<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Occasion;
use Illuminate\Http\Request;

class OccasionController extends Controller
{
    public function index()
    {
        $occasions = Occasion::where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json($occasions);
    }

    public function show($slug)
    {
        $occasion = Occasion::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json($occasion);
    }

    public function products($slug, Request $request)
    {
        $occasion = Occasion::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $query = $occasion->products()
            ->with('category')
            ->where('is_active', true);

        // Filter by category
        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by price range
        if ($request->has('price_min')) {
            $query->where('price', '>=', $request->price_min);
        }
        if ($request->has('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }

        // Search
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $products = $query->paginate($request->get('per_page', 12));

        return response()->json($products);
    }
}

