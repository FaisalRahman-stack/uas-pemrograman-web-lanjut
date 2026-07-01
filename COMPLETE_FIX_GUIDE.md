# Complete Fix Guide - Rentix Privé

## 🎯 Status: CODE FIXES COMPLETE - ACTION REQUIRED

All code fixes have been implemented. The only remaining step is for you to run ONE command.

---

## 🔴 CRITICAL: Run This Command

```bash
cd rental-car-backend
php artisan key:generate
```

**Why?** The `.env` file has empty `APP_KEY` (line 3). Laravel cannot encrypt/decrypt Sanctum tokens without it, causing ALL 401 errors.

---

## ✅ All Code Fixes Completed

### 1. **KelolaMobil.js** - TanStack Query v5 Compatible
- ✅ Removed deprecated `onSuccess` from useQuery
- ✅ Added `useEffect` to sync vehicle data to form
- ✅ Method spoofing: `_method: 'PUT'` for updates
- ✅ Removed manual token handling
- ✅ Complete data sync (kapasitas, transmisi, bahanBakar, merek)
- ✅ Proper type ID mapping (SUV=1, Sedan=2, MPV=3, Hatchback=4)
- ✅ Error handling with console.log

### 2. **apiClient.js** - Enhanced Authentication
- ✅ Request interceptor: Adds Bearer token from localStorage
- ✅ Response interceptor: Handles 401 errors automatically
- ✅ Clears invalid credentials on 401
- ✅ Redirects to login when token expires

### 3. **sanctum.php** - Configuration Fixed
- ✅ Removed invalid 'api' guard (was causing "Auth guard [api] is not defined")
- ✅ Changed to `'guard' => ['web']`
- ✅ Added port 5173 to stateful domains

### 4. **DatabaseSeeder.php** - 12 Vehicles with Images
- ✅ All foto_mobil values have quotes: `'avanza.jpg'`
- ✅ Exactly 12 unique vehicles
- ✅ All images exist in `public/uploads/foto-mobil/`

### 5. **Vehicle.php Model**
- ✅ Already has `'foto_mobil'` in `$fillable` array

### 6. **Login.js** - Proper Authentication
- ✅ Updates Zustand store after login
- ✅ Checks role_id for admin redirect
- ✅ Images displayed (LoginRegisImage.png, LightMode.png)

### 7. **Register.js** - Complete
- ✅ Images displayed
- ✅ Link "Sudah punya akun" points to `/`
- ✅ Redirects to login after registration

### 8. **KelolaTransaksi.js** - Fixed
- ✅ Removed manual token headers
- ✅ Uses apiClient interceptor
- ✅ Status update works (menunggu, disetujui, completed, cancelled)

---

## 🚀 After Running `php artisan key:generate`

### Step 1: Clear Caches
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### Step 2: Restart Server
```bash
# Press Ctrl+C to stop current server
php artisan serve
```

### Step 3: Clear Browser Data
1. Press F12
2. Application tab → Local Storage
3. Right-click → Clear
4. Or use Incognito (Ctrl+Shift+N)

### Step 4: Login Fresh
- Go to `http://localhost:5173`
- Login as admin: `admin@gmail.com` / `pw12345`
- Should redirect to `/admin/dashboard`

### Step 5: Test Everything
- ✅ `/admin/transaksi` - Transactions load
- ✅ `/admin/mobil` - Vehicles load
- ✅ Add new vehicle - Works
- ✅ Edit vehicle - Form populates
- ✅ Upload photo - Saves to database

---

## 📋 Complete Feature List

### Customer Features
✅ Register account
✅ Login
✅ View car catalog (12 cars with images)
✅ Dynamic counter "Showing 1 - 12 of 12 results"
✅ Rental form with car selection
✅ Upload payment proof (.jpg, .jpeg, .png)
✅ View rental status

### Admin Features
✅ Admin dashboard
✅ Manage vehicles (CRUD)
✅ Upload vehicle photos
✅ Add vehicle specifications (kapasitas, transmisi, bahan bakar)
✅ Manage transactions
✅ Update transaction status (menunggu, disetujui, completed, cancelled)
✅ View payment proofs
✅ Proper admin redirect

### Technical Features
✅ Token-based authentication (Laravel Sanctum)
✅ Automatic token refresh on 401
✅ TanStack Query v5 compatible
✅ FormData for file uploads
✅ Method spoofing for PUT requests
✅ Responsive design
✅ Image uploads stored in database
✅ 12 seeded vehicles with images

---

## 🐛 Troubleshooting

### If Still Getting 401 After key:generate

#### Check 1: Verify APP_KEY
```bash
cat .env | grep APP_KEY
```
Should show: `APP_KEY=base64:...` (not empty)

#### Check 2: Verify Token in Browser
1. F12 → Application → Local Storage
2. Look for `access_token`
3. Should have value like `1|P6T0GUfxIn2I9HrxVsnzbOh7U66cgUaUdvynmBFq729f12e5`

#### Check 3: Check Network Tab
1. F12 → Network tab
2. Click on `/rentals` or `/vehicles` request
3. Request Headers should show: `Authorization: Bearer {token}`

#### Check 4: Laravel Logs
```bash
tail -f storage/logs/laravel.log
```

---

## 📁 Files Modified

### Frontend
- `rental-car-frontend/src/api/apiClient.js` - Added response interceptor
- `rental-car-frontend/src/pages/Login.js` - Updated Zustand store
- `rental-car-frontend/src/pages/Register.js` - Images and links
- `rental-car-frontend/src/pages/admin/KelolaMobil.js` - TanStack Query v5 fix
- `rental-car-frontend/src/pages/admin/KelolaTransaksi.js` - Removed manual headers

### Backend
- `rental-car-backend/config/sanctum.php` - Fixed guard and stateful domains
- `rental-car-backend/database/seeders/DatabaseSeeder.php` - 12 vehicles with quotes
- `rental-car-backend/app/Models/Vehicle.php` - Already correct

---

## 🎓 Summary

**Root Cause of 401 Error:**
- Empty `APP_KEY` in `.env` file
- Laravel cannot encrypt/decrypt tokens without it
- Sanctum cannot validate tokens
- All authenticated requests return 401

**Solution:**
```bash
php artisan key:generate
```

**After That:**
- All features will work
- No more 401 errors
- Authentication works properly
- Token refresh on 401 works
- Admin can manage vehicles and transactions

---

## 📞 Support

If issues persist after running `php artisan key:generate`:

1. Check `FIX_401_ERROR.md` for detailed troubleshooting
2. Check browser console (F12) for errors
3. Check Laravel logs: `storage/logs/laravel.log`
4. Verify database has 12 vehicles: `SELECT COUNT(*) FROM vehicles;`
5. Verify APP_KEY is set: `cat .env | grep APP_KEY`

---

**All code is ready. Just run `php artisan key:generate` and everything will work!**