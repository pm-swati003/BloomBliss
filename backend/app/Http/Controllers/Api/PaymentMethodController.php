<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    public function index()
    {
        $paymentMethods = PaymentMethod::where('user_id', auth()->id())
            ->orderBy('is_default', 'desc')
            ->get();

        return response()->json($paymentMethods);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'last4' => 'required|string|size:4',
            'last_four' => 'sometimes|string|size:4', // Alternative field name
            'expiry' => 'required|string',
            'expiry_date' => 'sometimes|string', // Alternative field name
            'name' => 'required|string',
            'card_holder_name' => 'sometimes|string', // Alternative field name
            'is_default' => 'boolean',
        ]);
        
        // Handle alternative field names
        $last4 = $request->last4 ?? $request->last_four;
        $expiry = $request->expiry ?? $request->expiry_date;
        $name = $request->name ?? $request->card_holder_name;

        // If this is set as default, unset other defaults
        if ($request->is_default) {
            PaymentMethod::where('user_id', auth()->id())
                ->update(['is_default' => false]);
        }

        $paymentMethod = PaymentMethod::create([
            'user_id' => auth()->id(),
            'type' => $request->type,
            'last4' => $last4,
            'expiry' => $expiry,
            'name' => $name,
            'is_default' => $request->is_default ?? false,
        ]);

        return response()->json($paymentMethod, 201);
    }

    public function update(Request $request, $id)
    {
        $paymentMethod = PaymentMethod::where('user_id', auth()->id())
            ->findOrFail($id);

        $request->validate([
            'type' => 'sometimes|string',
            'last4' => 'sometimes|string|size:4',
            'expiry' => 'sometimes|string',
            'name' => 'sometimes|string',
            'is_default' => 'sometimes|boolean',
        ]);

        // If this is set as default, unset other defaults
        if ($request->is_default) {
            PaymentMethod::where('user_id', auth()->id())
                ->where('id', '!=', $id)
                ->update(['is_default' => false]);
        }

        $paymentMethod->update($request->only([
            'type', 'last4', 'expiry', 'name', 'is_default'
        ]));

        return response()->json($paymentMethod);
    }

    public function destroy($id)
    {
        $paymentMethod = PaymentMethod::where('user_id', auth()->id())
            ->findOrFail($id);

        $paymentMethod->delete();

        return response()->json(['message' => 'Payment method deleted']);
    }
}
