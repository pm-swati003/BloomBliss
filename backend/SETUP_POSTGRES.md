# Quick PostgreSQL Setup

## The Problem
Laravel is trying to use SQLite instead of PostgreSQL. This happens because:
1. The `.env` file has `DB_CONNECTION=sqlite`
2. PostgreSQL database might not exist yet

## Solution

### Step 1: Create PostgreSQL Database

Open PostgreSQL command line or pgAdmin and run:

```sql
CREATE DATABASE bloom_db;
```

Or use psql:
```bash
psql -U postgres
CREATE DATABASE bloom_db;
\q
```

### Step 2: Update .env File

Edit `backend/.env` and make sure it has:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=bloom_db
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
```

**OR** run the PowerShell script:
```powershell
cd backend
.\update_env.ps1
```

### Step 3: Clear Laravel Cache

```bash
cd backend
php artisan config:clear
php artisan cache:clear
```

### Step 4: Run Migrations

```bash
php artisan migrate
```

This will create all tables in your PostgreSQL database.

### Step 5: Verify

Test the connection:
```bash
php artisan tinker
```

Then type:
```php
DB::connection()->getPdo();
```

If successful, you'll see no errors.

## Common Issues

**"could not find driver"**
- PostgreSQL PHP extension is installed (we verified this)
- Make sure `DB_CONNECTION=pgsql` (not `sqlite`)

**"password authentication failed"**
- Check `DB_USERNAME` and `DB_PASSWORD` match your PostgreSQL credentials
- If your username is not `postgres`, update `DB_USERNAME`

**"database does not exist"**
- Make sure you created `bloom_db` database first
- Check `DB_DATABASE` name matches

**Still using SQLite?**
- Make sure `.env` has `DB_CONNECTION=pgsql`
- Run `php artisan config:clear`
- Restart Laravel server: `php artisan serve`

