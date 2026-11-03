<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        if ($request->filled('category')) {
            $category = $request->category;
            $query->whereHas('category', function ($q) use ($category) {
                if (is_numeric($category)) {
                    $q->where('id', (int) $category);
                } else {
                    $q->whereRaw('LOWER(slug) = ?', [strtolower((string) $category)]);
                }
            });
        }
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            } elseif ($request->status === 'out_of_stock') {
                $query->where('stock', '<=', 0);
            }
        }

        $query->orderBy($request->get('sort_by', 'created_at'), $request->get('sort_order', 'desc'));
        $perPage = (int) $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        $productIds = $products->pluck('id');
        $soldCounts = OrderItem::whereIn('product_id', $productIds)
            ->selectRaw('product_id, sum(quantity) as sold')
            ->groupBy('product_id')
            ->pluck('sold', 'product_id');

        $items = $products->getCollection()->map(function ($p) use ($soldCounts) {
            $p->sold = (int) ($soldCounts[$p->id] ?? 0);
            return $p;
        });
        $products->setCollection($items);

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'image' => 'nullable|string|url',
            'stock' => 'required|integer|min:0',
            'is_featured' => 'boolean',
            'is_best_selling' => 'boolean',
            'is_active' => 'boolean',
        ]);
        $data['slug'] = Str::slug($data['name']) . '-' . uniqid();
        $data['discount_percentage'] = $data['discount_percentage'] ?? 0;
        $data['is_featured'] = $data['is_featured'] ?? false;
        $data['is_best_selling'] = $data['is_best_selling'] ?? false;
        $data['is_active'] = $data['is_active'] ?? true;
        $product = Product::create($data);
        return response()->json($product->load('category'), 201);
    }

    public function update(Request $request, int $id)
    {
        $product = Product::findOrFail($id);
        $data = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'image' => 'nullable|string|url',
            'stock' => 'sometimes|integer|min:0',
            'is_featured' => 'boolean',
            'is_best_selling' => 'boolean',
            'is_active' => 'boolean',
        ]);
        // Always apply category_id when present (array_filter would remove 0, but we validate exists so it's valid when present)
        if (array_key_exists('category_id', $data)) {
            $product->category_id = $data['category_id'];
        }
        unset($data['category_id']);
        $product->fill(array_filter($data));
        $product->save();
        return response()->json($product->fresh('category'));
    }

    public function destroy(int $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted'], 200);
    }
}
