<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Admin roles (hierarchy: super_admin > admin > shop_keeper > customer)
    |--------------------------------------------------------------------------
    | Only ONE super_admin per application. Created via: php artisan admin:create-super-admin
    | Super admin can grant admin or shop_keeper role to others.
    */
    'roles' => [
        'super_admin' => 'Super Admin',   // Full access, can manage staff
        'admin'       => 'Admin',         // Manage products, orders, customers, settings
        'shop_keeper' => 'Shop Keeper',   // Orders + view customers only
        'delivery'    => 'Delivery',      // Delivery partner – view assigned/shipped orders, update location, mark delivered
        'customer'    => 'Customer',
    ],

    /*
    |--------------------------------------------------------------------------
    | Permissions per role (super_admin has all permissions implicitly)
    |--------------------------------------------------------------------------
    */
    'permissions' => [
        'manage_staff'       => 'Add/remove staff and change their role',
        'manage_products'    => 'Create, edit, delete products',
        'manage_orders'      => 'View and update orders',
        'view_customers'     => 'View customer list',
        'manage_settings'    => 'Change store settings',
        'manage_subscribers' => 'Manage newsletter subscribers, coupons and subscriber benefits',
    ],

    'role_permissions' => [
        'super_admin' => ['manage_staff', 'manage_products', 'manage_orders', 'view_customers', 'manage_settings', 'manage_subscribers'],
        'admin'       => ['manage_products', 'manage_orders', 'view_customers', 'manage_settings'],
        'shop_keeper' => ['manage_orders', 'view_customers'],
        'delivery'    => [],
        'customer'    => [],
    ],
];
