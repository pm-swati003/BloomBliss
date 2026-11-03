# Fix API Errors (404, 422, 500)

## Issues Fixed:

### 1. ✅ JWT Secret Generated
- Ran `php artisan jwt:secret --force`
- JWT_SECRET is now set in .env

### 2. ✅ CORS Configuration
- Created `config/cors.php` with proper settings
- Allowed origins: `http://localhost:5173`, `http://localhost:3000`
- Enabled CORS for all API routes

### 3. ✅ CSRF Protection
- Added CSRF exception for `api/*` routes
- API routes don't require CSRF tokens

### 4. ✅ Config Cache Cleared
- Cleared config and application cache

## Error Explanations:

### 404 Error
- **Cause**: Route not found or CORS blocking
- **Fixed**: CORS configured, routes verified

### 422 Error (Unprocessable Content)
- **Cause**: Validation error - this is NORMAL
- **Meaning**: The request data doesn't pass validation
- **Check**: Make sure you're sending:
  - `name` (required, string)
  - `email` (required, valid email, unique)
  - `password` (required, min 8 characters)
  - `password_confirmation` (must match password)

### 500 Error (Internal Server Error)
- **Cause**: JWT configuration issue
- **Fixed**: JWT secret generated and config cleared

## Testing:

1. **Restart Laravel server**:
```bash
cd backend
php artisan serve
```

2. **Test registration** with proper data:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

3. **Check browser console** - errors should be resolved

## If Still Getting Errors:

1. Check Laravel logs: `backend/storage/logs/laravel.log`
2. Verify .env has `JWT_SECRET` set
3. Make sure frontend .env has: `VITE_API_URL=http://localhost:8000/api`
4. Restart both frontend and backend servers

