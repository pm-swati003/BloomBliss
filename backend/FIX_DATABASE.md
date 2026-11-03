# Fix: Database Connection Error

## ✅ Fixed: .env File Updated

The `.env` file has been updated to use PostgreSQL:
- ✅ DB_CONNECTION=pgsql
- ✅ DB_HOST=127.0.0.1
- ✅ DB_PORT=5432
- ✅ DB_DATABASE=bloom_db
- ✅ DB_USERNAME=postgres
- ✅ DB_PASSWORD=your_postgres_password

## ⚠️ Next Step: Create Database

The database `bloom_db` doesn't exist yet. You need to create it.

### Option 1: Using psql (Command Line)

```bash
# Set password (Windows PowerShell)
$env:PGPASSWORD="your_postgres_password"

# Connect and create database
psql -U postgres -h 127.0.0.1 -c "CREATE DATABASE bloom_db;"
```

### Option 2: Using pgAdmin (GUI)

1. Open **pgAdmin**
2. Connect to your PostgreSQL server (usually `localhost` or `127.0.0.1`)
3. Right-click on **"Databases"** → **"Create"** → **"Database..."**
4. Enter database name: `bloom_db`
5. Click **"Save"**

### Option 3: Using SQL Command

Connect to PostgreSQL and run:
```sql
CREATE DATABASE bloom_db;
```

## After Creating Database

Once the database is created, run:

```bash
cd backend
php artisan migrate
```

This will create all the tables in your PostgreSQL database.

## Verify It Works

Test the connection:
```bash
php artisan tinker
```

Then type:
```php
DB::connection()->getPdo();
```

If successful, you'll see no errors and the connection is working!

