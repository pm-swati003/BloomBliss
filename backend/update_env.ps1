# PowerShell script to update .env file for PostgreSQL
# Run this from the backend directory

$envFile = ".env"

if (Test-Path $envFile) {
    # Read the current .env file
    $content = Get-Content $envFile -Raw
    
    # Replace SQLite with PostgreSQL configuration
    $content = $content -replace 'DB_CONNECTION=sqlite', 'DB_CONNECTION=pgsql'
    $content = $content -replace '# DB_HOST=127.0.0.1', 'DB_HOST=127.0.0.1'
    $content = $content -replace '# DB_PORT=3306', 'DB_PORT=5432'
    $content = $content -replace '# DB_DATABASE=laravel', 'DB_DATABASE=bloom_db'
    $content = $content -replace '# DB_USERNAME=root', 'DB_USERNAME=postgres'
    $content = $content -replace '# DB_PASSWORD=', 'DB_PASSWORD=your_postgres_password'
    
    # Write back to file
    Set-Content -Path $envFile -Value $content -NoNewline
    
    Write-Host ".env file updated successfully!" -ForegroundColor Green
    Write-Host "Please verify the settings match your PostgreSQL configuration." -ForegroundColor Yellow
} else {
    Write-Host ".env file not found!" -ForegroundColor Red
}

