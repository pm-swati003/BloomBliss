<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        $user->load(['orders', 'addresses', 'paymentMethods']);

        $stats = [
            'total_orders' => $user->orders()->count(),
            'total_spent' => $user->orders()->sum('total'),
            'reward_points' => $user->reward_points,
        ];

        return response()->json([
            'user' => $user,
            'stats' => $stats,
            'profile_completed' => $user->profile_completed,
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'sometimes|nullable|string',
            'birthday' => 'sometimes|nullable|date',
            'profile_completed' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $updateData = $request->only(['name', 'email', 'phone', 'birthday', 'profile_completed']);
        
        // Check if profile should be marked as completed
        if ($request->has('profile_completed') && $request->profile_completed) {
            // Verify that required fields are present
            $hasPhone = $user->phone || $request->has('phone');
            $hasBirthday = $user->birthday || $request->has('birthday');
            $hasAddress = $user->addresses()->count() > 0;
            $hasPaymentMethod = $user->paymentMethods()->count() > 0;
            
            if ($hasPhone && $hasBirthday && $hasAddress && $hasPaymentMethod) {
                $updateData['profile_completed'] = true;
            } else {
                return response()->json([
                    'error' => 'Profile cannot be completed. Please fill all required fields: phone, birthday, address, and payment method.',
                    'missing_fields' => [
                        'phone' => !$hasPhone,
                        'birthday' => !$hasBirthday,
                        'address' => !$hasAddress,
                        'payment_method' => !$hasPaymentMethod,
                    ]
                ], 422);
            }
        }

        $user->update($updateData);

        return response()->json([
            'user' => $user->fresh(),
            'profile_completed' => $user->profile_completed,
        ]);
    }
    
    public function completeProfile(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'birthday' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update([
            'phone' => $request->phone,
            'birthday' => $request->birthday,
        ]);

        // Check if profile is complete (has address and payment method)
        $hasAddress = $user->addresses()->count() > 0;
        $hasPaymentMethod = $user->paymentMethods()->count() > 0;

        if ($hasAddress && $hasPaymentMethod) {
            $user->update(['profile_completed' => true]);
        }

        return response()->json([
            'user' => $user->fresh(),
            'profile_completed' => $user->profile_completed,
            'message' => 'Profile updated successfully',
        ]);
    }

    public function updatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Password updated successfully']);
    }
}
