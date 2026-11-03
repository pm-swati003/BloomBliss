<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index()
    {
        $addresses = Address::where('user_id', auth()->id())
            ->orderBy('is_default', 'desc')
            ->get();

        return response()->json($addresses);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'name' => 'required|string',
            'street' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip' => 'required|string',
            'phone' => 'required|string',
            'is_default' => 'boolean',
        ]);

        // If this is set as default, unset other defaults
        if ($request->is_default) {
            Address::where('user_id', auth()->id())
                ->update(['is_default' => false]);
        }

        $address = Address::create([
            'user_id' => auth()->id(),
            'type' => $request->type,
            'name' => $request->name,
            'street' => $request->street,
            'city' => $request->city,
            'state' => $request->state,
            'zip' => $request->zip,
            'phone' => $request->phone,
            'is_default' => $request->is_default ?? false,
        ]);

        return response()->json($address, 201);
    }

    public function update(Request $request, $id)
    {
        $address = Address::where('user_id', auth()->id())
            ->findOrFail($id);

        $request->validate([
            'type' => 'sometimes|string',
            'name' => 'sometimes|string',
            'street' => 'sometimes|string',
            'city' => 'sometimes|string',
            'state' => 'sometimes|string',
            'zip' => 'sometimes|string',
            'phone' => 'sometimes|string',
            'is_default' => 'sometimes|boolean',
        ]);

        // If this is set as default, unset other defaults
        if ($request->is_default) {
            Address::where('user_id', auth()->id())
                ->where('id', '!=', $id)
                ->update(['is_default' => false]);
        }

        $address->update($request->only([
            'type', 'name', 'street', 'city', 'state', 'zip', 'phone', 'is_default'
        ]));

        return response()->json($address);
    }

    public function destroy($id)
    {
        $address = Address::where('user_id', auth()->id())
            ->findOrFail($id);

        $address->delete();

        return response()->json(['message' => 'Address deleted']);
    }
}
