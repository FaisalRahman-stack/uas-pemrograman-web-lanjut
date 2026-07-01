# Fix 401 Unauthorized Error

## Problem Identified

**APP_KEY is empty in .env file!**

Line 3 of `.env` shows: `APP_KEY=`

Laravel needs APP_KEY for:
- Token encryption/decryption
- Session encryption
- Cookie encryption

Without APP_KEY, Sanctum tokens cannot be validated, causing 401 errors.

## Solution Steps

### Step 1: Generate APP_KEY

```bash
cd rental-car-backend
php artisan key:generate
```

This will generate a new APP_KEY and update your `.env` file.

### Step 2: Clear All Caches

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Step 3: Restart Laravel Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
php artisan serve
```

### Step 4: Clear Browser Data

1. Press F12 in browser
2. Go to Application tab → Local Storage
3. Right-click → Clear
4. Or use Incognito window

### Step 5: Login Fresh

1. Go to `http://localhost:5173`
2. Login as admin: `admin@gmail.com` / `pw12345`
3. Token will be generated with proper encryption

### Step 6: Test

- Go to `/admin/transaksi` - should load without 401
- Go to `/admin/mobil` - should work without 401
- Check Network tab (F12) - all requests should have `Authorization: Bearer {token}`

## What Was Already Fixed

✅ **apiClient.js** - Uses localStorage for token
✅ **Login.js** - Saves token to localStorage and Zustand store
✅ **KelolaTransaksi.js** - Removed manual token headers
✅ **KelolaMobil.js** - Added method spoofing for PUT
✅ **sanctum.php** - Added port 5173 to stateful domains
✅ **sanctum.php** - Changed guard to `['web', 'api']`
✅ **DatabaseSeeder.php** - 12 vehicles with proper foto_mobil quotes
✅ **Vehicle.php** - foto_mobil in fillable array

## If Still Getting 401 After Key Generation

### Check 1: Verify APP_KEY is Set

```bash
cd rental-car-backend
cat .env | grep APP_KEY
```

Should show: `APP_KEY=base64:...`

### Check 2: Verify Token in Browser

1. F12 → Application → Local Storage
2. Look for `access_token` key
3. Should have value like `1|P6T0GUfxIn2I9HrxVsnzbOh7U66cgUaUdvynmBFq729f12e5`

### Check 3: Verify Request Headers

1. F12 → Network tab
2. Click on `/rentals` or `/vehicles` request
3. Check Request Headers
4. Should see: `Authorization: Bearer 1|P6T0GUfxIn2I9HrxVsnzbOh7U66cgUaUdvynmBFq729f12e5`

### Check 4: Check Laravel Logs

```bash
tail -f rental-car-backend/storage/logs/laravel.log
```

Look for authentication errors.

## Quick Test After Fix

```bash
# 1. Generate key
php artisan key:generate

# 2. Clear cache
php artisan config:clear

# 3. Restart server
php artisan serve

# 4. In another terminal, test API directly
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://127.0.0.1:8000/api/v1/rentals
```

## Expected Result

After fixing APP_KEY:
- ✅ Login works
- ✅ Token is generated
- ✅ API requests return 200 OK
- ✅ Transactions load
- ✅ Vehicles can be added/edited
- ✅ No more 401 errors

## Summary

The root cause was **empty APP_KEY** in `.env`. Without it:
- Laravel cannot encrypt tokens
- Sanctum cannot validate tokens
- All authenticated requests return 401

After running `php artisan key:generate`, everything should work!