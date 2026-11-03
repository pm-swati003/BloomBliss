<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Category;
use App\Models\Occasion;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\Address;
use App\Models\PaymentMethod;
use App\Models\Review;
use App\Models\DeliveryProfile;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Notification;
use App\Models\Setting;
use App\Models\Subscriber;
use App\Models\OTP;
use Illuminate\Support\Facades\DB;

class MigrateToAppwrite extends Command
{
    protected $signature = 'appwrite:migrate-db';
    protected $description = 'Migrate PostgreSQL database structure and data to Appwrite';

    private $endpoint;
    private $projectId;
    private $apiKey;
    private $databaseId;

    public function handle(): int
    {
        $this->endpoint = env('APPWRITE_ENDPOINT');
        $this->projectId = env('APPWRITE_PROJECT_ID');
        $this->apiKey = env('APPWRITE_API_KEY');
        $this->databaseId = env('APPWRITE_DATABASE_ID');

        if (!$this->endpoint || !$this->projectId || !$this->apiKey || !$this->databaseId) {
            $this->error('Appwrite environment variables are not fully configured in your .env file.');
            return self::FAILURE;
        }

        $this->info("=== Starting PostgreSQL to Appwrite Migration ===");
        $this->line("Endpoint: " . $this->endpoint);
        $this->line("Project ID: " . $this->projectId);
        $this->line("Database ID: " . $this->databaseId);

        // 1. Setup/Verify Database
        if (!$this->setupDatabase()) {
            return self::FAILURE;
        }

        // 2. Setup Collections (Deletes existing ones to start clean)
        if (!$this->setupCollections()) {
            return self::FAILURE;
        }

        // 3. Create normal attributes and wait
        $this->setupAttributes();

        // 4. Create relationship attributes and wait
        $this->setupRelationships();

        // 5. Migrate Users to Appwrite Auth
        $this->migrateUsersToAuth();

        // 6. Migrate Documents
        $this->migrateData();

        $this->info("\n=== Migration Completed Successfully! ===");
        return self::SUCCESS;
    }

    private function setupDatabase(): bool
    {
        $this->info("\n--- Verifying Database ---");
        
        // First check if the database already exists
        $response = $this->appwriteRequest('GET', "/databases/{$this->databaseId}");
        if ($response['code'] === 200) {
            $this->info("Database already exists in Appwrite (ID: {$this->databaseId}).");
            return true;
        }

        // Otherwise try to create it
        $this->info("Database does not exist. Trying to create database (ID: {$this->databaseId})...");
        $response = $this->appwriteRequest('POST', '/databases', [
            'databaseId' => $this->databaseId,
            'name' => 'Bloom Bliss Database'
        ]);

        if ($response['code'] === 409) {
            $this->info("Database already exists in Appwrite (ID: {$this->databaseId}).");
            return true;
        } elseif (in_array($response['code'], [200, 201])) {
            $this->info("Database 'Bloom Bliss Database' created successfully (ID: {$this->databaseId}).");
            return true;
        } else {
            $this->error("Failed to create database: " . json_encode($response['data']));
            return false;
        }
    }

    private function setupCollections(): bool
    {
        $this->info("\n--- Setting up Collections ---");
        $collections = [
            'users' => 'Users Profile',
            'categories' => 'Categories',
            'occasions' => 'Occasions',
            'coupons' => 'Coupons',
            'products' => 'Products',
            'addresses' => 'Addresses',
            'payment_methods' => 'Payment Methods',
            'reviews' => 'Reviews',
            'delivery_profiles' => 'Delivery Profiles',
            'cart_items' => 'Cart Items',
            'orders' => 'Orders',
            'order_items' => 'Order Items',
            'notifications' => 'Notifications',
            'settings' => 'Settings',
            'subscribers' => 'Subscribers',
            'otps' => 'OTPs',
        ];

        foreach ($collections as $id => $name) {
            if (!$this->createCollection($id, $name)) {
                return false;
            }
        }

        return true;
    }

    private function createCollection(string $collectionId, string $name): bool
    {
        // Check if collection exists
        $check = $this->appwriteRequest('GET', "/databases/{$this->databaseId}/collections/{$collectionId}");
        if ($check['code'] === 200) {
            $this->warn("Collection '{$collectionId}' already exists. Deleting it to start clean...");
            $delete = $this->appwriteRequest('DELETE', "/databases/{$this->databaseId}/collections/{$collectionId}");
            if ($delete['code'] !== 204) {
                $this->error("Failed to delete collection '{$collectionId}': " . json_encode($delete['data']));
            }
            
            // Poll until collection is deleted (GET returns 404)
            $this->info("Waiting for collection '{$collectionId}' deletion to complete...");
            $attempts = 0;
            while ($attempts < 30) {
                $verify = $this->appwriteRequest('GET', "/databases/{$this->databaseId}/collections/{$collectionId}");
                if ($verify['code'] === 404) {
                    break;
                }
                $attempts++;
                sleep(1);
            }
        }

        $this->info("Creating collection '{$collectionId}'...");
        $response = $this->appwriteRequest('POST', "/databases/{$this->databaseId}/collections", [
            'collectionId' => $collectionId,
            'name' => $name,
            'permissions' => [
                'read("any")',
                'create("any")',
                'update("any")',
                'delete("any")'
            ]
        ]);

        if (!in_array($response['code'], [200, 201])) {
            $this->error("Failed to create collection '{$collectionId}': " . json_encode($response['data']));
            return false;
        }
        return true;
    }

    private function setupAttributes()
    {
        $this->info("\n--- Creating Attributes ---");

        // 1. users
        $this->info("Defining attributes for 'users'...");
        $this->createStringAttribute('users', 'name', 255, true);
        $this->createStringAttribute('users', 'email', 255, true);
        $this->createStringAttribute('users', 'phone', 255, false);
        $this->createDatetimeAttribute('users', 'birthday', false);
        $this->createIntegerAttribute('users', 'reward_points', false, 0);
        $this->createBooleanAttribute('users', 'profile_completed', false, false);
        $this->createBooleanAttribute('users', 'is_admin', false, false);
        $this->createStringAttribute('users', 'role', 255, false, 'customer');
        $this->createFloatAttribute('users', 'delivery_rating', false);
        $this->createDatetimeAttribute('users', 'created_at', false);
        $this->createDatetimeAttribute('users', 'updated_at', false);

        // 2. categories
        $this->info("Defining attributes for 'categories'...");
        $this->createStringAttribute('categories', 'name', 255, true);
        $this->createStringAttribute('categories', 'slug', 255, true);
        $this->createStringAttribute('categories', 'description', 65535, false);
        $this->createStringAttribute('categories', 'image', 255, false);
        $this->createBooleanAttribute('categories', 'is_active', false, true);
        $this->createDatetimeAttribute('categories', 'created_at', false);
        $this->createDatetimeAttribute('categories', 'updated_at', false);

        // 3. occasions
        $this->info("Defining attributes for 'occasions'...");
        $this->createStringAttribute('occasions', 'name', 255, true);
        $this->createStringAttribute('occasions', 'slug', 255, true);
        $this->createStringAttribute('occasions', 'description', 65535, false);
        $this->createStringAttribute('occasions', 'image', 255, false);
        $this->createBooleanAttribute('occasions', 'is_active', false, true);
        $this->createDatetimeAttribute('occasions', 'created_at', false);
        $this->createDatetimeAttribute('occasions', 'updated_at', false);

        // 4. coupons
        $this->info("Defining attributes for 'coupons'...");
        $this->createStringAttribute('coupons', 'code', 255, true);
        $this->createStringAttribute('coupons', 'description', 65535, false);
        $this->createStringAttribute('coupons', 'discount_type', 255, true);
        $this->createFloatAttribute('coupons', 'value', true);
        $this->createFloatAttribute('coupons', 'min_order', false);
        $this->createBooleanAttribute('coupons', 'for_subscribers_only', false, false);
        $this->createDatetimeAttribute('coupons', 'valid_from', false);
        $this->createDatetimeAttribute('coupons', 'valid_until', false);
        $this->createIntegerAttribute('coupons', 'usage_limit', false);
        $this->createIntegerAttribute('coupons', 'used_count', false, 0);
        $this->createBooleanAttribute('coupons', 'is_active', false, true);
        $this->createDatetimeAttribute('coupons', 'created_at', false);
        $this->createDatetimeAttribute('coupons', 'updated_at', false);

        // 5. products
        $this->info("Defining attributes for 'products'...");
        $this->createStringAttribute('products', 'name', 255, true);
        $this->createStringAttribute('products', 'slug', 255, true);
        $this->createStringAttribute('products', 'description', 65535, false);
        $this->createFloatAttribute('products', 'price', true);
        $this->createFloatAttribute('products', 'discount_percentage', false, 0.0);
        $this->createStringAttribute('products', 'image', 255, false);
        $this->createStringAttribute('products', 'images', 255, false, null, true); // array: true
        $this->createIntegerAttribute('products', 'stock', false, 0);
        $this->createBooleanAttribute('products', 'is_featured', false, false);
        $this->createBooleanAttribute('products', 'is_best_selling', false, false);
        $this->createBooleanAttribute('products', 'is_active', false, true);
        $this->createDatetimeAttribute('products', 'created_at', false);
        $this->createDatetimeAttribute('products', 'updated_at', false);

        // 6. addresses
        $this->info("Defining attributes for 'addresses'...");
        $this->createStringAttribute('addresses', 'type', 255, true);
        $this->createStringAttribute('addresses', 'name', 255, true);
        $this->createStringAttribute('addresses', 'street', 255, true);
        $this->createStringAttribute('addresses', 'city', 255, true);
        $this->createStringAttribute('addresses', 'state', 255, true);
        $this->createStringAttribute('addresses', 'zip', 255, true);
        $this->createStringAttribute('addresses', 'phone', 255, true);
        $this->createBooleanAttribute('addresses', 'is_default', false, false);
        $this->createDatetimeAttribute('addresses', 'created_at', false);
        $this->createDatetimeAttribute('addresses', 'updated_at', false);

        // 7. payment_methods
        $this->info("Defining attributes for 'payment_methods'...");
        $this->createStringAttribute('payment_methods', 'type', 255, true);
        $this->createStringAttribute('payment_methods', 'last4', 4, true);
        $this->createStringAttribute('payment_methods', 'expiry', 255, true);
        $this->createStringAttribute('payment_methods', 'name', 255, true);
        $this->createBooleanAttribute('payment_methods', 'is_default', false, false);
        $this->createDatetimeAttribute('payment_methods', 'created_at', false);
        $this->createDatetimeAttribute('payment_methods', 'updated_at', false);

        // 8. reviews
        $this->info("Defining attributes for 'reviews'...");
        $this->createIntegerAttribute('reviews', 'rating', true);
        $this->createStringAttribute('reviews', 'comment', 65535, false);
        $this->createDatetimeAttribute('reviews', 'created_at', false);
        $this->createDatetimeAttribute('reviews', 'updated_at', false);

        // 9. delivery_profiles
        $this->info("Defining attributes for 'delivery_profiles'...");
        $this->createStringAttribute('delivery_profiles', 'vehicle_type', 255, true);
        $this->createStringAttribute('delivery_profiles', 'vehicle_model', 255, true);
        $this->createStringAttribute('delivery_profiles', 'license_plate', 255, true);
        $this->createStringAttribute('delivery_profiles', 'license_number', 255, true);
        $this->createStringAttribute('delivery_profiles', 'document_path', 255, false);
        $this->createBooleanAttribute('delivery_profiles', 'is_verified', false, false);
        $this->createStringAttribute('delivery_profiles', 'vehicle_photo_path', 255, false);
        $this->createStringAttribute('delivery_profiles', 'profile_photo_path', 255, false);
        $this->createStringAttribute('delivery_profiles', 'id_proof_path', 255, false);
        $this->createDatetimeAttribute('delivery_profiles', 'created_at', false);
        $this->createDatetimeAttribute('delivery_profiles', 'updated_at', false);

        // 10. cart_items
        $this->info("Defining attributes for 'cart_items'...");
        $this->createIntegerAttribute('cart_items', 'quantity', false, 1);
        $this->createStringAttribute('cart_items', 'size', 255, false);
        $this->createStringAttribute('cart_items', 'occasion', 255, false);
        $this->createDatetimeAttribute('cart_items', 'created_at', false);
        $this->createDatetimeAttribute('cart_items', 'updated_at', false);

        // 11. orders
        $this->info("Defining attributes for 'orders'...");
        $this->createStringAttribute('orders', 'order_number', 255, true);
        $this->createFloatAttribute('orders', 'subtotal', true);
        $this->createFloatAttribute('orders', 'shipping', false, 0.0);
        $this->createFloatAttribute('orders', 'discount', false, 0.0);
        $this->createFloatAttribute('orders', 'total', true);
        $this->createStringAttribute('orders', 'status', 255, false, 'pending');
        $this->createStringAttribute('orders', 'tracking_number', 255, false);
        $this->createDatetimeAttribute('orders', 'delivery_date', false);
        $this->createStringAttribute('orders', 'delivery_time', 255, false);
        $this->createFloatAttribute('orders', 'rider_lat', false);
        $this->createFloatAttribute('orders', 'rider_lng', false);
        $this->createDatetimeAttribute('orders', 'estimated_delivery_at', false);
        $this->createFloatAttribute('orders', 'delivery_lat', false);
        $this->createFloatAttribute('orders', 'delivery_lng', false);
        $this->createFloatAttribute('orders', 'distance_km', false);
        $this->createFloatAttribute('orders', 'delivery_earnings', false);
        $this->createStringAttribute('orders', 'rider', 255, false);
        $this->createDatetimeAttribute('orders', 'created_at', false);
        $this->createDatetimeAttribute('orders', 'updated_at', false);

        // 12. order_items
        $this->info("Defining attributes for 'order_items'...");
        $this->createStringAttribute('order_items', 'product_name', 255, true);
        $this->createFloatAttribute('order_items', 'price', true);
        $this->createIntegerAttribute('order_items', 'quantity', false, 1);
        $this->createStringAttribute('order_items', 'size', 255, false);
        $this->createStringAttribute('order_items', 'occasion', 255, false);
        $this->createDatetimeAttribute('order_items', 'created_at', false);
        $this->createDatetimeAttribute('order_items', 'updated_at', false);

        // 13. notifications
        $this->info("Defining attributes for 'notifications'...");
        $this->createStringAttribute('notifications', 'type', 255, true);
        $this->createStringAttribute('notifications', 'title', 255, true);
        $this->createStringAttribute('notifications', 'body', 65535, true);
        $this->createStringAttribute('notifications', 'data', 65535, false);
        $this->createDatetimeAttribute('notifications', 'read_at', false);
        $this->createDatetimeAttribute('notifications', 'created_at', false);
        $this->createDatetimeAttribute('notifications', 'updated_at', false);

        // 14. settings
        $this->info("Defining attributes for 'settings'...");
        $this->createStringAttribute('settings', 'key', 255, true);
        $this->createStringAttribute('settings', 'value', 65535, false);
        $this->createDatetimeAttribute('settings', 'created_at', false);
        $this->createDatetimeAttribute('settings', 'updated_at', false);

        // 15. subscribers
        $this->info("Defining attributes for 'subscribers'...");
        $this->createStringAttribute('subscribers', 'email', 255, true);
        $this->createDatetimeAttribute('subscribers', 'subscribed_at', true);
        $this->createDatetimeAttribute('subscribers', 'created_at', false);
        $this->createDatetimeAttribute('subscribers', 'updated_at', false);

        // 16. otps
        $this->info("Defining attributes for 'otps'...");
        $this->createStringAttribute('otps', 'email', 255, true);
        $this->createStringAttribute('otps', 'otp', 255, true);
        $this->createStringAttribute('otps', 'purpose', 255, true);
        $this->createDatetimeAttribute('otps', 'expires_at', true);
        $this->createBooleanAttribute('otps', 'used', false, false);
        $this->createDatetimeAttribute('otps', 'created_at', false);
        $this->createDatetimeAttribute('otps', 'updated_at', false);

        // Wait for attributes to build
        $collections = [
            'users', 'categories', 'occasions', 'coupons', 'products',
            'addresses', 'payment_methods', 'reviews', 'delivery_profiles',
            'cart_items', 'orders', 'order_items', 'notifications',
            'settings', 'subscribers', 'otps'
        ];
        foreach ($collections as $col) {
            $this->waitForCollectionReady($this->databaseId, $col);
        }
    }

    private function setupRelationships()
    {
        $this->info("\n--- Creating Relationships ---");

        // 1. products -> category (categories)
        $this->createRelationshipAttribute('products', 'categories', 'manyToOne', false, 'category', '', 'cascade');

        // 2. occasions <-> products (manyToMany)
        $this->createRelationshipAttribute('occasions', 'products', 'manyToMany', true, 'products', 'occasions');

        // 3. addresses -> user (users)
        $this->createRelationshipAttribute('addresses', 'users', 'manyToOne', false, 'user', '', 'cascade');

        // 4. payment_methods -> user (users)
        $this->createRelationshipAttribute('payment_methods', 'users', 'manyToOne', false, 'user', '', 'cascade');

        // 5. reviews -> user (users)
        $this->createRelationshipAttribute('reviews', 'users', 'manyToOne', false, 'user', '', 'cascade');

        // 6. reviews -> product (products)
        $this->createRelationshipAttribute('reviews', 'products', 'manyToOne', false, 'product', '', 'cascade');

        // 7. delivery_profiles -> user (users) (oneToOne, one-way to bypass Appwrite index bug)
        $this->createRelationshipAttribute('delivery_profiles', 'users', 'oneToOne', false, 'user', '', 'cascade');

        // 8. cart_items -> user (users)
        $this->createRelationshipAttribute('cart_items', 'users', 'manyToOne', false, 'user', '', 'cascade');

        // 9. cart_items -> product (products)
        $this->createRelationshipAttribute('cart_items', 'products', 'manyToOne', false, 'product', '', 'cascade');

        // 10. orders -> user (users)
        $this->createRelationshipAttribute('orders', 'users', 'manyToOne', false, 'user', '', 'cascade');

        // 12. orders -> shipping_address (addresses)
        $this->createRelationshipAttribute('orders', 'addresses', 'manyToOne', false, 'shipping_address', '', 'setNull');

        // 13. orders -> payment_method (payment_methods)
        $this->createRelationshipAttribute('orders', 'payment_methods', 'manyToOne', false, 'payment_method', '', 'setNull');

        // 14. orders -> coupon (coupons)
        $this->createRelationshipAttribute('orders', 'coupons', 'manyToOne', false, 'coupon', '', 'setNull');

        // 15. order_items -> order (orders)
        $this->createRelationshipAttribute('order_items', 'orders', 'manyToOne', false, 'order', '', 'cascade');

        // 16. order_items -> product (products)
        $this->createRelationshipAttribute('order_items', 'products', 'manyToOne', false, 'product', '', 'cascade');

        // 17. notifications -> user (users)
        $this->createRelationshipAttribute('notifications', 'users', 'manyToOne', false, 'user', '', 'cascade');

        // 18. subscribers -> user (users)
        $this->createRelationshipAttribute('subscribers', 'users', 'manyToOne', false, 'user', '', 'cascade');

        // Wait for relationship attributes to build
        $collections = [
            'products', 'occasions', 'addresses', 'payment_methods',
            'reviews', 'delivery_profiles', 'cart_items', 'orders',
            'order_items', 'notifications', 'subscribers'
        ];
        foreach ($collections as $col) {
            $this->waitForCollectionReady($this->databaseId, $col);
        }
    }

    private function migrateUsersToAuth()
    {
        $this->info("\n--- Migrating Users to Appwrite Auth and Profiles ---");
        $users = User::all();
        $this->line("Found " . $users->count() . " users in PostgreSQL.");

        foreach ($users as $user) {
            $this->info("Migrating user: {$user->email}...");
            
            // Create in Appwrite Auth with Bcrypt hash
            $response = $this->appwriteRequest('POST', '/users/bcrypt', [
                'userId' => (string)$user->id,
                'email' => $user->email,
                'password' => $user->password,
                'name' => $user->name,
            ]);

            if (!in_array($response['code'], [200, 201])) {
                if ($response['code'] === 409) {
                    $this->line("   User already exists in Appwrite Auth.");
                } else {
                    $this->warn("   Bcrypt import failed (Code: {$response['code']}). Trying standard creation...");
                    $response = $this->appwriteRequest('POST', '/users', [
                        'userId' => (string)$user->id,
                        'email' => $user->email,
                        'password' => 'BloomBliss123!',
                        'name' => $user->name,
                    ]);
                    if (!in_array($response['code'], [200, 201, 409])) {
                        $this->error("   Failed to create user in Auth: " . json_encode($response['data']));
                        continue;
                    }
                }
            } else {
                $this->line("   Created user in Appwrite Auth.");
            }

            // Set phone if valid
            if ($user->phone) {
                $cleanPhone = preg_replace('/[^\d+]/', '', $user->phone);
                if (str_starts_with($cleanPhone, '+')) {
                    $this->appwriteRequest('PATCH', "/users/" . $user->id . "/phone", [
                        'phone' => $cleanPhone
                    ]);
                }
            }

            // Create document in users collection
            $birthday = $user->birthday ? (is_string($user->birthday) ? date('c', strtotime($user->birthday)) : $user->birthday->toIso8601String()) : null;
            $data = [
                'name' => (string)$user->name,
                'email' => (string)$user->email,
                'phone' => $user->phone ? (string)$user->phone : null,
                'birthday' => $birthday,
                'reward_points' => (int)($user->reward_points ?? 0),
                'profile_completed' => (bool)($user->profile_completed ?? false),
                'is_admin' => (bool)($user->is_admin ?? false),
                'role' => (string)($user->role ?? 'customer'),
                'delivery_rating' => $user->delivery_rating !== null ? (float)$user->delivery_rating : null,
                'created_at' => $user->created_at?->toIso8601String(),
                'updated_at' => $user->updated_at?->toIso8601String(),
            ];

            $this->createDocument('users', (string)$user->id, $data);
        }
    }

    private function migrateData()
    {
        $this->info("\n--- Migrating Core Data ---");

        // 1. Categories
        $this->info("Migrating categories...");
        foreach (Category::all() as $record) {
            $this->createDocument('categories', (string)$record->id, [
                'name' => (string)$record->name,
                'slug' => (string)$record->slug,
                'description' => $record->description ? (string)$record->description : null,
                'image' => $record->image ? (string)$record->image : null,
                'is_active' => (bool)($record->is_active ?? true),
                'created_at' => $record->created_at?->toIso8601String(),
                'updated_at' => $record->updated_at?->toIso8601String(),
            ]);
        }

        // 2. Occasions
        $this->info("Migrating occasions...");
        foreach (Occasion::all() as $record) {
            $this->createDocument('occasions', (string)$record->id, [
                'name' => (string)$record->name,
                'slug' => (string)$record->slug,
                'description' => $record->description ? (string)$record->description : null,
                'image' => $record->image ? (string)$record->image : null,
                'is_active' => (bool)($record->is_active ?? true),
                'created_at' => $record->created_at?->toIso8601String(),
                'updated_at' => $record->updated_at?->toIso8601String(),
            ]);
        }

        // 3. Coupons
        $this->info("Migrating coupons...");
        foreach (Coupon::all() as $record) {
            $this->createDocument('coupons', (string)$record->id, [
                'code' => (string)$record->code,
                'description' => $record->description ? (string)$record->description : null,
                'discount_type' => (string)$record->discount_type,
                'value' => (float)$record->value,
                'min_order' => $record->min_order !== null ? (float)$record->min_order : null,
                'for_subscribers_only' => (bool)($record->for_subscribers_only ?? false),
                'valid_from' => $record->valid_from?->toIso8601String(),
                'valid_until' => $record->valid_until?->toIso8601String(),
                'usage_limit' => $record->usage_limit !== null ? (int)$record->usage_limit : null,
                'used_count' => (int)($record->used_count ?? 0),
                'is_active' => (bool)($record->is_active ?? true),
                'created_at' => $record->created_at?->toIso8601String(),
                'updated_at' => $record->updated_at?->toIso8601String(),
            ]);
        }

        // 4. Products
        $this->info("Migrating products...");
        foreach (Product::all() as $record) {
            $occasionIds = $record->occasions()->pluck('occasions.id')->map(fn($id) => (string)$id)->toArray();
            $this->createDocument('products', (string)$record->id, [
                'name' => (string)$record->name,
                'slug' => (string)$record->slug,
                'description' => $record->description ? (string)$record->description : null,
                'price' => (float)$record->price,
                'discount_percentage' => (float)($record->discount_percentage ?? 0.0),
                'image' => $record->image ? (string)$record->image : null,
                'images' => is_array($record->images) ? array_map('strval', $record->images) : [],
                'stock' => (int)($record->stock ?? 0),
                'is_featured' => (bool)($record->is_featured ?? false),
                'is_best_selling' => (bool)($record->is_best_selling ?? false),
                'is_active' => (bool)($record->is_active ?? true),
                'category' => (string)$record->category_id,
                'occasions' => $occasionIds,
                'created_at' => $record->created_at?->toIso8601String(),
                'updated_at' => $record->updated_at?->toIso8601String(),
            ]);
        }

        // 5. Addresses
        $this->info("Migrating addresses...");
        foreach (Address::all() as $record) {
            $this->createDocument('addresses', (string)$record->id, [
                'type' => (string)$record->type,
                'name' => (string)$record->name,
                'street' => (string)$record->street,
                'city' => (string)$record->city,
                'state' => (string)$record->state,
                'zip' => (string)$record->zip,
                'phone' => (string)$record->phone,
                'is_default' => (bool)($record->is_default ?? false),
                'user' => (string)$record->user_id,
                'created_at' => $record->created_at?->toIso8601String(),
                'updated_at' => $record->updated_at?->toIso8601String(),
            ]);
        }

        // 6. Payment Methods
        $this->info("Migrating payment methods...");
        foreach (PaymentMethod::all() as $record) {
            $this->createDocument('payment_methods', (string)$record->id, [
                'type' => (string)$record->type,
                'last4' => (string)$record->last4,
                'expiry' => (string)$record->expiry,
                'name' => (string)$record->name,
                'is_default' => (bool)($record->is_default ?? false),
                'user' => (string)$record->user_id,
                'created_at' => $record->created_at?->toIso8601String(),
                'updated_at' => $record->updated_at?->toIso8601String(),
            ]);
        }

        // 7. Reviews
        $this->info("Migrating reviews...");
        foreach (Review::all() as $record) {
            $this->createDocument('reviews', (string)$record->id, [
                'rating' => (int)$record->rating,
                'comment' => $record->comment ? (string)$record->comment : null,
                'user' => (string)$record->user_id,
                'product' => (string)$record->product_id,
                'created_at' => $record->created_at?->toIso8601String(),
                'updated_at' => $record->updated_at?->toIso8601String(),
            ]);
        }

        // 8. Delivery Profiles
        $this->info("Migrating delivery profiles...");
        foreach (DeliveryProfile::all() as $record) {
            $this->createDocument('delivery_profiles', (string)$record->id, [
                'vehicle_type' => (string)$record->vehicle_type,
                'vehicle_model' => (string)$record->vehicle_model,
                'license_plate' => (string)$record->license_plate,
                'license_number' => (string)$record->license_number,
                'document_path' => $record->document_path ? (string)$record->document_path : null,
                'is_verified' => (bool)($record->is_verified ?? false),
                'vehicle_photo_path' => $record->vehicle_photo_path ? (string)$record->vehicle_photo_path : null,
                'profile_photo_path' => $record->profile_photo_path ? (string)$record->profile_photo_path : null,
                'id_proof_path' => $record->id_proof_path ? (string)$record->id_proof_path : null,
                'user' => (string)$record->user_id,
                'created_at' => $record->created_at?->toIso8601String(),
                'updated_at' => $record->updated_at?->toIso8601String(),
            ]);
        }

        // 9. Cart Items
        $this->info("Migrating cart items...");
        foreach (CartItem::all() as $record) {
            $this->createDocument('cart_items', (string)$record->id, [
                'quantity' => (int)($record->quantity ?? 1),
                'size' => $record->size ? (string)$record->size : null,
                'occasion' => $record->occasion ? (string)$record->occasion : null,
                'user' => (string)$record->user_id,
                'product' => (string)$record->product_id,
                'created_at' => $record->created_at?->toIso8601String(),
                'updated_at' => $record->updated_at?->toIso8601String(),
            ]);
        }

        // 10. Orders
        $this->info("Migrating orders...");
        foreach (Order::all() as $record) {
            $deliveryDate = $record->delivery_date ? (is_string($record->delivery_date) ? date('c', strtotime($record->delivery_date)) : $record->delivery_date->toIso8601String()) : null;
            $estDelivery = $record->estimated_delivery_at ? (is_string($record->estimated_delivery_at) ? date('c', strtotime($record->estimated_delivery_at)) : $record->estimated_delivery_at->toIso8601String()) : null;

            $this->createDocument('orders', (string)$record->id, [
                'order_number' => (string)$record->order_number,
                'subtotal' => (float)$record->subtotal,
                'shipping' => (float)($record->shipping ?? 0.0),
                'discount' => (float)($record->discount ?? 0.0),
                'total' => (float)$record->total,
                'status' => (string)($record->status ?? 'pending'),
                'tracking_number' => $record->tracking_number ? (string)$record->tracking_number : null,
                'delivery_date' => $deliveryDate,
                'delivery_time' => $record->delivery_time ? (string)$record->delivery_time : null,
                'rider_lat' => $record->rider_lat !== null ? (float)$record->rider_lat : null,
                'rider_lng' => $record->rider_lng !== null ? (float)$record->rider_lng : null,
                'estimated_delivery_at' => $estDelivery,
                'delivery_lat' => $record->delivery_lat !== null ? (float)$record->delivery_lat : null,
                'delivery_lng' => $record->delivery_lng !== null ? (float)$record->delivery_lng : null,
                'distance_km' => $record->distance_km !== null ? (float)$record->distance_km : null,
                'delivery_earnings' => $record->delivery_earnings !== null ? (float)$record->delivery_earnings : null,
                'user' => (string)$record->user_id,
                'rider' => $record->rider_user_id ? (string)$record->rider_user_id : null,
                'shipping_address' => $record->shipping_address_id ? (string)$record->shipping_address_id : null,
                'payment_method' => $record->payment_method_id ? (string)$record->payment_method_id : null,
                'coupon' => $record->coupon_id ? (string)$record->coupon_id : null,
                'created_at' => $record->created_at?->toIso8601String(),
                'updated_at' => $record->updated_at?->toIso8601String(),
            ]);
        }

        // 11. Order Items
        $this->info("Migrating order items...");
        foreach (OrderItem::all() as $record) {
            $this->createDocument('order_items', (string)$record->id, [
                'product_name' => (string)$record->product_name,
                'price' => (float)$record->price,
                'quantity' => (int)($record->quantity ?? 1),
                'size' => $record->size ? (string)$record->size : null,
                'occasion' => $record->occasion ? (string)$record->occasion : null,
                'order' => (string)$record->order_id,
                'product' => (string)$record->product_id,
                'created_at' => $record->created_at?->toIso8601String(),
                'updated_at' => $record->updated_at?->toIso8601String(),
            ]);
        }

        // 12. Notifications
        $this->info("Migrating notifications...");
        foreach (Notification::all() as $record) {
            $this->createDocument('notifications', (string)$record->id, [
                'type' => (string)$record->type,
                'title' => (string)$record->title,
                'body' => (string)$record->body,
                'data' => $record->data ? json_encode($record->data) : null,
                'read_at' => $record->read_at?->toIso8601String(),
                'user' => (string)$record->user_id,
                'created_at' => $record->created_at?->toIso8601String(),
                'updated_at' => $record->updated_at?->toIso8601String(),
            ]);
        }

        // 13. Settings
        $this->info("Migrating settings...");
        foreach (Setting::all() as $record) {
            $this->createDocument('settings', (string)$record->id, [
                'key' => (string)$record->key,
                'value' => $record->value ? (string)$record->value : null,
                'created_at' => $record->created_at?->toIso8601String(),
                'updated_at' => $record->updated_at?->toIso8601String(),
            ]);
        }

        // 14. Subscribers
        $this->info("Migrating subscribers...");
        foreach (Subscriber::all() as $record) {
            $this->createDocument('subscribers', (string)$record->id, [
                'email' => (string)$record->email,
                'subscribed_at' => $record->subscribed_at ? (is_string($record->subscribed_at) ? date('c', strtotime($record->subscribed_at)) : $record->subscribed_at->toIso8601String()) : null,
                'user' => $record->user_id ? (string)$record->user_id : null,
                'created_at' => $record->created_at?->toIso8601String(),
                'updated_at' => $record->updated_at?->toIso8601String(),
            ]);
        }

        // 15. OTPs
        $this->info("Migrating OTPs...");
        try {
            $records = OTP::all();
        } catch (\Throwable $e) {
            $records = DB::table('otps')->get();
        }
        foreach ($records as $record) {
            $expiresAt = isset($record->expires_at) ? (is_string($record->expires_at) ? date('c', strtotime($record->expires_at)) : $record->expires_at->toIso8601String()) : null;
            $this->createDocument('otps', (string)$record->id, [
                'email' => (string)$record->email,
                'otp' => (string)$record->otp,
                'purpose' => (string)$record->purpose,
                'expires_at' => $expiresAt,
                'used' => (bool)($record->used ?? false),
                'created_at' => isset($record->created_at) ? date('c', strtotime($record->created_at)) : null,
                'updated_at' => isset($record->updated_at) ? date('c', strtotime($record->updated_at)) : null,
            ]);
        }
    }

    private function createDocument(string $collectionId, string $documentId, array $data): bool
    {
        $response = $this->appwriteRequest('POST', "/databases/{$this->databaseId}/collections/{$collectionId}/documents", [
            'documentId' => $documentId,
            'data' => $data,
        ]);
        if (!in_array($response['code'], [200, 201])) {
            $this->error("Failed to create document {$documentId} in {$collectionId}: " . json_encode($response['data']));
            return false;
        }
        return true;
    }

    private function createStringAttribute(string $collectionId, string $key, int $size, bool $required, $default = null, bool $array = false)
    {
        $body = [
            'key' => $key,
            'size' => $size,
            'required' => $required,
            'array' => $array,
        ];
        if ($default !== null) {
            $body['default'] = $default;
        }
        $response = $this->appwriteRequest('POST', "/databases/{$this->databaseId}/collections/{$collectionId}/attributes/string", $body);
        if (!in_array($response['code'], [200, 201, 202])) {
            $this->error("Failed to create string attribute '{$key}' on '{$collectionId}': " . json_encode($response['data']));
        }
    }

    private function createIntegerAttribute(string $collectionId, string $key, bool $required, $default = null, bool $array = false)
    {
        $body = [
            'key' => $key,
            'required' => $required,
            'array' => $array,
        ];
        if ($default !== null) {
            $body['default'] = (int)$default;
        }
        $response = $this->appwriteRequest('POST', "/databases/{$this->databaseId}/collections/{$collectionId}/attributes/integer", $body);
        if (!in_array($response['code'], [200, 201, 202])) {
            $this->error("Failed to create integer attribute '{$key}' on '{$collectionId}': " . json_encode($response['data']));
        }
    }

    private function createFloatAttribute(string $collectionId, string $key, bool $required, $default = null, bool $array = false)
    {
        $body = [
            'key' => $key,
            'required' => $required,
            'array' => $array,
        ];
        if ($default !== null) {
            $body['default'] = (float)$default;
        }
        $response = $this->appwriteRequest('POST', "/databases/{$this->databaseId}/collections/{$collectionId}/attributes/float", $body);
        if (!in_array($response['code'], [200, 201, 202])) {
            $this->error("Failed to create float attribute '{$key}' on '{$collectionId}': " . json_encode($response['data']));
        }
    }

    private function createBooleanAttribute(string $collectionId, string $key, bool $required, $default = null, bool $array = false)
    {
        $body = [
            'key' => $key,
            'required' => $required,
            'array' => $array,
        ];
        if ($default !== null) {
            $body['default'] = (bool)$default;
        }
        $response = $this->appwriteRequest('POST', "/databases/{$this->databaseId}/collections/{$collectionId}/attributes/boolean", $body);
        if (!in_array($response['code'], [200, 201, 202])) {
            $this->error("Failed to create boolean attribute '{$key}' on '{$collectionId}': " . json_encode($response['data']));
        }
    }

    private function createDatetimeAttribute(string $collectionId, string $key, bool $required, bool $array = false)
    {
        $body = [
            'key' => $key,
            'required' => $required,
            'array' => $array,
        ];
        $response = $this->appwriteRequest('POST', "/databases/{$this->databaseId}/collections/{$collectionId}/attributes/datetime", $body);
        if (!in_array($response['code'], [200, 201, 202])) {
            $this->error("Failed to create datetime attribute '{$key}' on '{$collectionId}': " . json_encode($response['data']));
        }
    }

    private function createRelationshipAttribute(string $collectionId, string $relatedCollectionId, string $type, bool $twoWay, string $key, string $twoWayKey = '', string $onDelete = 'cascade')
    {
        $body = [
            'relatedCollectionId' => $relatedCollectionId,
            'type' => $type,
            'twoWay' => $twoWay,
            'key' => $key,
            'onDelete' => $onDelete,
        ];
        if ($twoWay && !empty($twoWayKey)) {
            $body['twoWayKey'] = $twoWayKey;
        }
        $response = $this->appwriteRequest('POST', "/databases/{$this->databaseId}/collections/{$collectionId}/attributes/relationship", $body);
        if (!in_array($response['code'], [200, 201, 202])) {
            $this->error("Failed to create relationship attribute '{$key}' on '{$collectionId}': " . json_encode($response['data']));
        }
    }

    private function waitForCollectionReady(string $databaseId, string $collectionId): bool
    {
        $this->info("Waiting for collection '{$collectionId}' attributes to become available...");
        $attempts = 0;
        while ($attempts < 45) {
            $response = $this->appwriteRequest('GET', "/databases/{$databaseId}/collections/{$collectionId}");
            if ($response['code'] === 200) {
                $allAvailable = true;
                $nonAvailableDetails = [];
                foreach ($response['data']['attributes'] ?? [] as $attr) {
                    if ($attr['status'] !== 'available') {
                        $allAvailable = false;
                        $nonAvailableDetails[] = "{$attr['key']} ({$attr['status']})";
                    }
                }
                if ($allAvailable) {
                    return true;
                }
                if ($attempts % 5 === 0) {
                    $this->line("   Still waiting for attributes: " . implode(', ', $nonAvailableDetails));
                }
            }
            $attempts++;
            sleep(1);
        }
        
        // Timeout diagnostics
        $response = $this->appwriteRequest('GET', "/databases/{$databaseId}/collections/{$collectionId}");
        if ($response['code'] === 200) {
            $this->error("Collection '{$collectionId}' attributes status at timeout:");
            foreach ($response['data']['attributes'] ?? [] as $attr) {
                $this->error("   Attribute '{$attr['key']}': {$attr['status']} (Error message: " . ($attr['error'] ?? 'none') . ")");
            }
        }
        $this->warn("Timeout waiting for collection '{$collectionId}' attributes to become available.");
        return false;
    }

    private function appwriteRequest(string $method, string $path, ?array $body = null): array
    {
        $url = $this->endpoint . $path;
        $ch = curl_init($url);
        
        $headers = [
            'X-Appwrite-Project: ' . $this->projectId,
            'X-Appwrite-Key: ' . $this->apiKey,
            'Content-Type: application/json',
            'Accept: application/json'
        ];
        
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        return [
            'code' => $httpCode,
            'data' => json_decode($response, true)
        ];
    }
}
