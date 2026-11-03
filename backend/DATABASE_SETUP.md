# PostgreSQL Database Setup Guide

## Step 1: Create PostgreSQL Database

First, you need to create the database in PostgreSQL. You can do this using one of these methods:

### Method 1: Using psql (Command Line)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE bloom_db;

# Exit psql
\q
```

### Method 2: Using pgAdmin (GUI)

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases" → "Create" → "Database"
4. Name it: `bloom_db`
5. Click "Save"

## Step 2: Configure .env File

Make sure your `backend/.env` file has these settings:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=bloom_db
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
```

**Important Notes:**
- Replace `postgres` with your PostgreSQL username if different
- Make sure the password matches your PostgreSQL password
- The database name should match what you created in Step 1

## Step 3: Clear Config Cache

After updating .env, clear Laravel's config cache:

```bash
cd backend
php artisan config:clear
php artisan cache:clear
```

## Step 4: Run Migrations

Now run the migrations to create all tables:

```bash
php artisan migrate
```

This will create all the necessary tables:
- users
- categories
- products
- cart_items
- orders
- order_items
- addresses
- payment_methods
- reviews

## Step 5: Verify Connection

Test the database connection:

```bash
php artisan tinker
```

Then in tinker:
```php
DB::connection()->getPdo();
```

If it connects successfully, you'll see no errors.

## Troubleshooting

### Error: "could not find driver"
- Make sure PostgreSQL PHP extension is installed: `php -m | findstr pgsql`
- If not installed, install it: `php -m install pdo_pgsql`

### Error: "password authentication failed"
- Check your DB_USERNAME and DB_PASSWORD in .env
- Make sure they match your PostgreSQL credentials

### Error: "database does not exist"
- Make sure you created the database first (Step 1)
- Check DB_DATABASE name in .env matches the created database

### Still using SQLite?
- Make sure DB_CONNECTION=pgsql in .env (not sqlite)
- Run `php artisan config:clear`
- Restart your Laravel server

