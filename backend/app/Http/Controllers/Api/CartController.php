<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = CartItem::with('product')
            ->where('user_id', auth()->id())
            ->get();

        return response()->json($cartItems);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'size' => 'nullable|string',
            'occasion' => 'nullable|string',
        ]);

        $cartItem = CartItem::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'product_id' => $request->product_id,
                'size' => $request->size,
                'occasion' => $request->occasion,
            ],
            [
                'quantity' => $request->quantity,
            ]
        );

        return response()->json($cartItem->load('product'), 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::where('user_id', auth()->id())
            ->findOrFail($id);

        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json($cartItem->load('product'));
    }

    public function destroy($id)
    {
        $cartItem = CartItem::where('user_id', auth()->id())
            ->findOrFail($id);

        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart']);
    }

    public function count()
    {
        $count = CartItem::where('user_id', auth()->id())->sum('quantity');
        return response()->json(['count' => $count]);
    }
}
