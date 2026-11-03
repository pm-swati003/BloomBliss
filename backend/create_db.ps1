# PowerShell script to create PostgreSQL database
# Make sure PostgreSQL is running and psql is in your PATH

Write-Host "Creating PostgreSQL database 'bloom_db'..." -ForegroundColor Yellow

# Try to create the database using psql
$createDbCommand = "CREATE DATABASE bloom_db;"

# Method 1: Using psql directly
try {
    if (-not $env:PGPASSWORD) {
        $env:PGPASSWORD = Read-Host -Prompt "Enter your PostgreSQL password"
    }
    & psql -U postgres -h 127.0.0.1 -c $createDbCommand
    Write-Host "Database 'bloom_db' created successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error creating database. Please create it manually:" -ForegroundColor Red
    Write-Host "1. Open pgAdmin or psql" -ForegroundColor Yellow
    Write-Host "2. Connect to PostgreSQL server" -ForegroundColor Yellow
    Write-Host "3. Run: CREATE DATABASE bloom_db;" -ForegroundColor Yellow
}

