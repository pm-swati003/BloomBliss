<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

use App\Models\OTP;
use App\Mail\OtpMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
   public function register(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => trim($request->name),
            'email' => trim(strtolower($request->email)),
            'password' => Hash::make($request->password),
        ]);

        // Delete any old unused OTPs for this email
        OTP::where('email', $user->email)
            ->where('purpose', 'email_verification')
            ->where('used', false)
            ->delete();

        // Generate a new OTP
        $otpRecord = OTP::generate($user->email, 'email_verification');

        // Send the OTP via email (using log driver – writes to storage/logs/laravel.log)
        Mail::to($user->email)->send(new OtpMail($otpRecord->otp, 'email_verification'));

        // Also log the OTP to the Laravel log for easy debugging
        Log::info('OTP for ' . $user->email . ': ' . $otpRecord->otp);

        return response()->json([
            'message' => 'User registered. Please verify your email with the OTP sent.',
            'user' => $user,
        ], 201);

    } catch (\Exception $e) {
        Log::error('Registration error: ' . $e->getMessage());
        return response()->json([
            'message' => 'Registration failed',
            'error' => $e->getMessage() // Remove this line for production
        ], 500);
    }
}

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = auth()->user();
        
        // For refresh token, we'll use the same token but store it separately
        // The refresh endpoint will accept expired tokens within refresh_ttl window
        $refreshToken = $token; // Same token, but used for refresh

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60, // in seconds
        ]);
    }

    public function me()
    {
        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }
            if ($user->role === 'delivery') {
                $user->load('profile');
            }
            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Successfully logged out']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Successfully logged out']);
        }
    }

    public function refresh(Request $request)
    {
        try {
            // Try to get refresh token from request body first
            $refreshToken = $request->input('refresh_token');
            
            // If not in body, try to get from Authorization header
            if (!$refreshToken) {
                try {
                    $refreshToken = JWTAuth::getToken();
                } catch (\Exception $e) {
                    // Token might be expired, try to get from request
                    $refreshToken = $request->bearerToken();
                }
            }
            
            if (!$refreshToken) {
                return response()->json(['error' => 'Refresh token not provided'], 401);
            }

            // Use the refresh method which handles expired tokens within refresh_ttl window
            // This will generate a new token even if the old one is expired (within refresh window)
            $newToken = JWTAuth::setToken($refreshToken)->refresh();
            
            // Get user from the new token
            $user = JWTAuth::setToken($newToken)->authenticate();
            
            if (!$user) {
                return response()->json(['error' => 'Invalid refresh token'], 401);
            }

            // Return new token (same token can be used as refresh token)
            return response()->json([
                'token' => $newToken,
                'refresh_token' => $newToken, // Same token for simplicity
                'token_type' => 'bearer',
                'expires_in' => config('jwt.ttl') * 60, // in seconds
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Token refresh failed',
                'message' => $e->getMessage()
            ], 401);
        }
    }
    // ... inside AuthController

    /**
     * Helper to search for a user in Appwrite Auth by email.
     */
    private function getAppwriteUserByEmail(string $email): ?array
    {
        $endpoint = env('APPWRITE_ENDPOINT', 'https://sgp.cloud.appwrite.io/v1');
        $projectId = env('APPWRITE_PROJECT_ID');
        $apiKey = env('APPWRITE_API_KEY');

        if (!$projectId || !$apiKey) {
            return null;
        }

        $searchUrl = $endpoint . '/users?search=' . urlencode($email);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $searchUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'X-Appwrite-Project: ' . $projectId,
            'X-Appwrite-Key: ' . $apiKey
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            return null;
        }

        $usersData = json_decode($response, true);
        if (empty($usersData['users'])) {
            return null;
        }

        foreach ($usersData['users'] as $user) {
            if (isset($user['email']) && strtolower(trim($user['email'])) === strtolower(trim($email))) {
                return $user;
            }
        }

        return $usersData['users'][0] ?? null;
    }

    /**
     * Send OTP for verification or password reset
     */
    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'purpose' => 'required|in:email_verification,password_reset',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $email = trim(strtolower($request->email));
        $purpose = $request->purpose;

        // Search user in Appwrite Auth
        $appwriteUser = $this->getAppwriteUserByEmail($email);
        if (!$appwriteUser) {
            return response()->json(['error' => 'User not found in Appwrite Auth'], 404);
        }

        // For email_verification, ensure user is not already verified
        if ($purpose === 'email_verification' && ($appwriteUser['emailVerification'] ?? false)) {
            return response()->json(['message' => 'Email already verified'], 400);
        }

        // Generate a 6-digit OTP
        $otp = sprintf("%06d", mt_rand(100000, 999999));
        
        // Save to cache for 10 minutes (600 seconds)
        \Illuminate\Support\Facades\Cache::put('otp_' . $email . '_' . $purpose, $otp, 600);

        // Send email via log mailer
        Mail::to($email)->send(new OtpMail($otp, $purpose));

        // Log the OTP for easy debugging
        Log::info('OTP for ' . $email . ' (' . $purpose . '): ' . $otp);

        return response()->json([
            'message' => 'OTP sent to your email address',
            'expires_in' => 10 // minutes
        ]);
    }

    /**
     * Verify OTP
     */
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
            'purpose' => 'required|in:email_verification,password_reset',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $email = trim(strtolower($request->email));
        $purpose = $request->purpose;

        $cachedOtp = \Illuminate\Support\Facades\Cache::get('otp_' . $email . '_' . $purpose);

        if (!$cachedOtp || $cachedOtp !== $request->otp) {
            return response()->json(['error' => 'Invalid or expired OTP'], 400);
        }

        // Mark OTP as verified (delete from cache)
        \Illuminate\Support\Facades\Cache::forget('otp_' . $email . '_' . $purpose);

        if ($purpose === 'email_verification') {
            // Update emailVerification status in Appwrite Auth
            $appwriteUser = $this->getAppwriteUserByEmail($email);
            if ($appwriteUser) {
                $endpoint = env('APPWRITE_ENDPOINT', 'https://sgp.cloud.appwrite.io/v1');
                $projectId = env('APPWRITE_PROJECT_ID');
                $apiKey = env('APPWRITE_API_KEY');

                $updateUrl = $endpoint . '/users/' . $appwriteUser['$id'] . '/verification';
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $updateUrl);
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, [
                    'X-Appwrite-Project: ' . $projectId,
                    'X-Appwrite-Key: ' . $apiKey,
                    'Content-Type: application/json'
                ]);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
                    'emailVerification' => true
                ]));
                curl_exec($ch);
                curl_close($ch);
            }
            return response()->json(['message' => 'Email verified successfully']);
        }

        // For password_reset, generate a temporary reset token
        $resetToken = \Illuminate\Support\Str::random(60);
        \Illuminate\Support\Facades\Cache::put('reset_token_' . $resetToken, $email, 600);
        
        return response()->json([
            'message' => 'OTP verified. You may now reset your password.',
            'reset_token' => $resetToken
        ]);
    }

    /**
     * Reset password after OTP verification
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reset_token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $email = \Illuminate\Support\Facades\Cache::get('reset_token_' . $request->reset_token);
        if (!$email) {
            return response()->json(['error' => 'Invalid or expired reset token'], 400);
        }

        $appwriteUser = $this->getAppwriteUserByEmail($email);
        if (!$appwriteUser) {
            return response()->json(['error' => 'User not found in Appwrite Auth'], 404);
        }

        $endpoint = env('APPWRITE_ENDPOINT', 'https://sgp.cloud.appwrite.io/v1');
        $projectId = env('APPWRITE_PROJECT_ID');
        $apiKey = env('APPWRITE_API_KEY');

        // Update the password in Appwrite Auth
        $updateUrl = $endpoint . '/users/' . $appwriteUser['$id'] . '/password';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $updateUrl);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'X-Appwrite-Project: ' . $projectId,
            'X-Appwrite-Key: ' . $apiKey,
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'password' => $request->password
        ]));
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            $errData = json_decode($response, true);
            return response()->json(['error' => $errData['message'] ?? 'Failed to update password in Appwrite'], 400);
        }

        // Clear the cache
        \Illuminate\Support\Facades\Cache::forget('reset_token_' . $request->reset_token);

        return response()->json(['message' => 'Password reset successfully']);
    }
}
