<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\PaymentMethodController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\OccasionController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminOrderController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Admin\AdminCustomerController;
use App\Http\Controllers\Api\Admin\AdminStaffController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminSettingsController;
use App\Http\Controllers\Api\Admin\AdminSubscriberController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\DeliveryController;

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/

// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    // OTP and password reset routes – no extra '/auth' here
    Route::post('/send-otp', [AuthController::class, 'sendOtp']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Category Routes
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::get('/{id}', [CategoryController::class, 'show']);
});

// Occasion Routes
Route::prefix('occasions')->group(function () {
    Route::get('/', [OccasionController::class, 'index']);
    Route::get('/{slug}', [OccasionController::class, 'show']);
    Route::get('/{slug}/products', [OccasionController::class, 'products']);
});

// Product Routes
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/best-selling', [ProductController::class, 'bestSelling']);
    Route::get('/{id}', [ProductController::class, 'show']);
});

// Review Routes (Public - Read Only)
Route::prefix('reviews')->group(function () {
    Route::get('/', [ReviewController::class, 'index']);
});

// Newsletter (public – no auth required)
Route::get('/newsletter/benefits', [NewsletterController::class, 'benefits']);
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);

// Coupon validation (public – for checkout)
Route::post('/coupons/validate', [CouponController::class, 'validate']);

/*
|--------------------------------------------------------------------------
| Protected API Routes (Require Authentication)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {
    
    // Authentication Routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // User Profile Routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::post('/complete', [ProfileController::class, 'completeProfile']);
        Route::put('/password', [ProfileController::class, 'updatePassword']);
    });

    // Shopping Cart Routes
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/', [CartController::class, 'store']);
        Route::get('/count', [CartController::class, 'count']);
        Route::put('/{id}', [CartController::class, 'update']);
        Route::delete('/{id}', [CartController::class, 'destroy']);
    });

    // Order Routes
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/{id}', [OrderController::class, 'show']);
        Route::get('/{id}/tracking', [OrderController::class, 'tracking']);
    });

    // Notifications (order updates, review requests)
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::put('/{id}/read', [NotificationController::class, 'markRead']);
        Route::post('/mark-all-read', [NotificationController::class, 'markAllRead']);
    });

    // Address Routes
    Route::prefix('addresses')->group(function () {
        Route::get('/', [AddressController::class, 'index']);
        Route::post('/', [AddressController::class, 'store']);
        Route::put('/{id}', [AddressController::class, 'update']);
        Route::delete('/{id}', [AddressController::class, 'destroy']);
    });

    // Payment Method Routes
    Route::prefix('payment-methods')->group(function () {
        Route::get('/', [PaymentMethodController::class, 'index']);
        Route::post('/', [PaymentMethodController::class, 'store']);
        Route::put('/{id}', [PaymentMethodController::class, 'update']);
        Route::delete('/{id}', [PaymentMethodController::class, 'destroy']);
    });

    // Newsletter perks for logged-in user (benefits + subscriber-only coupon codes)
    Route::get('/newsletter/my-perks', [NewsletterController::class, 'myPerks']);

    // Review Routes (Protected - Create/Update/Delete)
    Route::prefix('reviews')->group(function () {
        Route::post('/', [ReviewController::class, 'store']);
        Route::put('/{id}', [ReviewController::class, 'update']);
        Route::delete('/{id}', [ReviewController::class, 'destroy']);
    });

    // Admin Routes (Require Authentication + Admin Role). Some require specific permissions.
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminDashboardController::class, 'stats']);
        Route::get('/recent-orders', [AdminDashboardController::class, 'recentOrders']);
        Route::get('/deliveries-due-today', [AdminDashboardController::class, 'deliveriesDueToday']);
        Route::get('/low-stock', [AdminDashboardController::class, 'lowStock']);
        Route::get('/config', [AdminStaffController::class, 'config']);
        Route::middleware('permission:manage_settings')->group(function () {
            Route::get('/settings', [AdminSettingsController::class, 'index']);
            Route::put('/settings', [AdminSettingsController::class, 'update']);
        });
        Route::middleware('permission:manage_orders')->group(function () {
            Route::get('/orders', [AdminOrderController::class, 'index']);
            Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
            Route::get('/orders/{id}/tracking', [AdminOrderController::class, 'tracking']);
            Route::put('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
            Route::put('/orders/{id}/tracking', [AdminOrderController::class, 'updateTracking']);
        });
        Route::middleware('permission:manage_products')->group(function () {
            Route::get('/categories', [AdminCategoryController::class, 'index']);
            Route::post('/categories', [AdminCategoryController::class, 'store']);
            Route::get('/products', [AdminProductController::class, 'index']);
            Route::post('/products', [AdminProductController::class, 'store']);
            Route::put('/products/{id}', [AdminProductController::class, 'update']);
            Route::delete('/products/{id}', [AdminProductController::class, 'destroy']);
        });
        Route::middleware('permission:view_customers')->group(function () {
            Route::get('/customers', [AdminCustomerController::class, 'index']);
        });
        Route::middleware('permission:manage_staff')->group(function () {
            Route::get('/staff', [AdminStaffController::class, 'index']);
            Route::post('/staff', [AdminStaffController::class, 'store']);
            Route::put('/staff/{id}/role', [AdminStaffController::class, 'updateRole']);
        });
        Route::middleware('permission:manage_subscribers')->group(function () {
            Route::get('/subscribers', [AdminSubscriberController::class, 'indexSubscribers']);
            Route::get('/coupons', [AdminSubscriberController::class, 'indexCoupons']);
            Route::post('/coupons', [AdminSubscriberController::class, 'storeCoupon']);
            Route::put('/coupons/{id}', [AdminSubscriberController::class, 'updateCoupon']);
            Route::delete('/coupons/{id}', [AdminSubscriberController::class, 'destroyCoupon']);
            Route::get('/subscriber-benefits', [AdminSubscriberController::class, 'getSubscriberBenefits']);
            Route::put('/subscriber-benefits', [AdminSubscriberController::class, 'updateSubscriberBenefits']);
        });
    });

    // Delivery partner routes (role = delivery only)
    Route::middleware('delivery')->prefix('delivery')->group(function () {
        Route::post('/profile', [DeliveryController::class, 'updateProfile']);
        Route::get('/orders', [DeliveryController::class, 'orders']);
        Route::get('/stats', [DeliveryController::class, 'stats']);
        Route::put('/orders/{id}/location', [DeliveryController::class, 'updateLocation']);
        Route::put('/orders/{id}/delivered', [DeliveryController::class, 'markDelivered']);
    });
});

