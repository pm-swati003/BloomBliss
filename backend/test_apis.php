<?php

/**
 * API Testing Script
 * Run this to test all API endpoints
 * Usage: php test_apis.php
 */

$baseUrl = 'http://localhost:8000/api';
$token = null;

// Helper function to make API requests
function apiRequest($method, $endpoint, $data = null, $token = null) {
    global $baseUrl;
    
    $url = $baseUrl . $endpoint;
    $ch = curl_init($url);
    
    $headers = [
        'Content-Type: application/json',
        'Accept: application/json',
    ];
    
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'data' => json_decode($response, true),
    ];
}

echo "=== API Testing ===\n\n";

// 1. Test Register
echo "1. Testing Register...\n";
$registerData = [
    'name' => 'Test User',
    'email' => 'test' . time() . '@example.com',
    'password' => 'password123',
    'password_confirmation' => 'password123',
];
$result = apiRequest('POST', '/register', $registerData);
if ($result['code'] === 201) {
    echo "   ✅ Register: SUCCESS\n";
    $token = $result['data']['token'] ?? null;
} else {
    echo "   ❌ Register: FAILED (Code: {$result['code']})\n";
    print_r($result['data']);
}

// 2. Test Login
echo "\n2. Testing Login...\n";
$loginData = [
    'email' => 'test@example.com',
    'password' => 'password',
];
$result = apiRequest('POST', '/login', $loginData);
if ($result['code'] === 200) {
    echo "   ✅ Login: SUCCESS\n";
    if (!$token) {
        $token = $result['data']['token'] ?? null;
    }
} else {
    echo "   ⚠️  Login: " . ($result['code'] === 401 ? 'Invalid credentials (expected if user not exists)' : "FAILED (Code: {$result['code']})") . "\n";
}

// 3. Test Categories
echo "\n3. Testing Categories...\n";
$result = apiRequest('GET', '/categories');
if ($result['code'] === 200 && isset($result['data'][0])) {
    echo "   ✅ Get Categories: SUCCESS (Found " . count($result['data']) . " categories)\n";
} else {
    echo "   ❌ Get Categories: FAILED (Code: {$result['code']})\n";
}

// 4. Test Products
echo "\n4. Testing Products...\n";
$result = apiRequest('GET', '/products');
if ($result['code'] === 200) {
    $products = $result['data']['data'] ?? $result['data'];
    $count = is_array($products) ? count($products) : 0;
    echo "   ✅ Get Products: SUCCESS (Found {$count} products)\n";
} else {
    echo "   ❌ Get Products: FAILED (Code: {$result['code']})\n";
}

// 5. Test Best Selling Products
echo "\n5. Testing Best Selling Products...\n";
$result = apiRequest('GET', '/products/featured/best-selling');
if ($result['code'] === 200 && isset($result['data'][0])) {
    echo "   ✅ Best Selling: SUCCESS (Found " . count($result['data']) . " products)\n";
} else {
    echo "   ❌ Best Selling: FAILED (Code: {$result['code']})\n";
}

// 6. Test Reviews
echo "\n6. Testing Reviews...\n";
$result = apiRequest('GET', '/reviews');
if ($result['code'] === 200) {
    echo "   ✅ Get Reviews: SUCCESS\n";
} else {
    echo "   ❌ Get Reviews: FAILED (Code: {$result['code']})\n";
}

// Protected routes (require token)
if ($token) {
    echo "\n=== Protected Routes (with token) ===\n";
    
    // 7. Test Me
    echo "\n7. Testing /me...\n";
    $result = apiRequest('GET', '/me', null, $token);
    if ($result['code'] === 200) {
        echo "   ✅ Get Me: SUCCESS\n";
    } else {
        echo "   ❌ Get Me: FAILED (Code: {$result['code']})\n";
    }
    
    // 8. Test Cart
    echo "\n8. Testing Cart...\n";
    $result = apiRequest('GET', '/cart', null, $token);
    if ($result['code'] === 200) {
        echo "   ✅ Get Cart: SUCCESS\n";
    } else {
        echo "   ❌ Get Cart: FAILED (Code: {$result['code']})\n";
    }
    
    // 9. Test Cart Count
    echo "\n9. Testing Cart Count...\n";
    $result = apiRequest('GET', '/cart/count', null, $token);
    if ($result['code'] === 200) {
        echo "   ✅ Cart Count: SUCCESS (Count: " . ($result['data']['count'] ?? 0) . ")\n";
    } else {
        echo "   ❌ Cart Count: FAILED (Code: {$result['code']})\n";
    }
    
    // 10. Test Add to Cart
    echo "\n10. Testing Add to Cart...\n";
    $cartData = [
        'product_id' => 1,
        'quantity' => 2,
    ];
    $result = apiRequest('POST', '/cart', $cartData, $token);
    if ($result['code'] === 201) {
        echo "   ✅ Add to Cart: SUCCESS\n";
    } else {
        echo "   ❌ Add to Cart: FAILED (Code: {$result['code']})\n";
    }
    
    // 11. Test Profile
    echo "\n11. Testing Profile...\n";
    $result = apiRequest('GET', '/profile', null, $token);
    if ($result['code'] === 200) {
        echo "   ✅ Get Profile: SUCCESS\n";
    } else {
        echo "   ❌ Get Profile: FAILED (Code: {$result['code']})\n";
    }
    
    // 12. Test Orders
    echo "\n12. Testing Orders...\n";
    $result = apiRequest('GET', '/orders', null, $token);
    if ($result['code'] === 200) {
        echo "   ✅ Get Orders: SUCCESS\n";
    } else {
        echo "   ❌ Get Orders: FAILED (Code: {$result['code']})\n";
    }
    
    // 13. Test Addresses
    echo "\n13. Testing Addresses...\n";
    $result = apiRequest('GET', '/addresses', null, $token);
    if ($result['code'] === 200) {
        echo "   ✅ Get Addresses: SUCCESS\n";
    } else {
        echo "   ❌ Get Addresses: FAILED (Code: {$result['code']})\n";
    }
    
    // 14. Test Payment Methods
    echo "\n14. Testing Payment Methods...\n";
    $result = apiRequest('GET', '/payment-methods', null, $token);
    if ($result['code'] === 200) {
        echo "   ✅ Get Payment Methods: SUCCESS\n";
    } else {
        echo "   ❌ Get Payment Methods: FAILED (Code: {$result['code']})\n";
    }
} else {
    echo "\n⚠️  Skipping protected routes - no token available\n";
}

echo "\n=== Testing Complete ===\n";

