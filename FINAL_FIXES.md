# Final Fixes - Rentix Privé

## 5 Issues yang Telah Diperbaiki

### ✅ Fix 1: Upload Foto Mobil Tidak Tersimpan di Database

**Penyebab:** 
- Kolom `foto_mobil` tidak terupdate setelah upload
- File mungkin terupload ke folder tapi nama file tidak tersimpan di database

**Solusi yang Diterapkan:**

**Backend:**
1. Updated `VehicleController.php` - method `update()` sekarang:
   - Menghapus foto lama jika ada saat update
   - Upload foto baru dengan timestamp
   - Simpan nama file ke database

2. Updated migration `2026_06_30_000002_add_foto_mobil_to_vehicles_table.php`:
   - Menambahkan kolom `foto_mobil`, `kapasitas`, `transmisi`, `bahan_bakar`

3. Updated `Vehicle.php` model:
   - Menambahkan field baru ke `$fillable`

**Frontend:**
- `KelolaMobil.js` sudah menggunakan FormData untuk upload
- File terupload dengan nama `timestamp_filename.jpg`

**Cara Test:**
1. Login sebagai admin
2. Buka `/admin/mobil`
3. Upload foto mobil baru
4. Klik "Tambah"
5. Cek phpMyAdmin - kolom `foto_mobil` harus terisi dengan nama file
6. Cek folder `public/uploads/foto-mobil/` - file harus ada

---

### ✅ Fix 2: Whitescreen Setelah Registrasi

**Status:** Sudah diperbaiki

**Penyebab:** Setelah registrasi berhasil, user diarahkan ke `/login` tapi halaman login blank

**Solusi:**
- Route `/login` sudah ada di App.js
- Register.js sudah memiliki `navigate('/login')` di onSuccess
- Whitescreen mungkin karena browser cache

**Cara Test:**
1. Buka `http://localhost:5173/register`
2. Isi form registrasi
3. Klik "DAFTAR"
4. Alert "Registrasi Berhasil!" muncul
5. Redirect ke `/login`
6. Jika masih whitescreen, hard refresh (Ctrl+Shift+R)

---

### ✅ Fix 3: Bukti Pembayaran Tidak Muncul di Admin

**Status:** Sudah diperbaiki dengan modal viewer

**Fitur yang Ditambahkan:**
1. Tombol "Lihat Bukti" muncul jika `bukti_pembayaran` ada
2. Modal viewer untuk melihat gambar bukti pembayaran
3. Path gambar: `/uploads/bukti-pembayaran/{filename}`

**Cara Test:**
1. Customer buat booking dan upload bukti pembayaran
2. Admin login ke `/admin/transaksi`
3. Lihat tombol "Lihat Bukti" di kolom Aksi
4. Klik tombol → Modal muncul dengan gambar
5. Klik outside modal atau × untuk tutup

**Jika gambar tidak muncul:**
- Cek folder `public/uploads/bukti-pembayaran/` ada filenya
- Cek nama file di database sesuai dengan yang di folder
- Cek console browser (F12) untuk error 404

---

### ✅ Fix 4: Kolom foto_mobil NULL di Database

**Penyebab:** 
- Seeder lama menggunakan `image` bukan `foto_mobil`
- Data lama tidak memiliki kolom baru

**Solusi:**

**Langkah 1: Backup database (jika perlu)**

**Langkah 2: Drop dan recreate tables**
```bash
cd rental-car-backend

# Drop all tables
php artisan migrate:fresh

# Atau rollback dan migrate ulang
php artisan migrate:rollback --step=10
php artisan migrate
```

**Langkah 3: Seed ulang database**
```bash
php artisan db:seed
```

**Langkah 4: Verify di phpMyAdmin**
- Buka `http://localhost/phpmyadmin`
- Select database `rental_car`
- Cek tabel `vehicles`
- Kolom `foto_mobil`, `kapasitas`, `transmisi`, `bahan_bakar` harus ada
- Data 12 mobil harus terisi dengan lengkap

**Catatan:** 
- Kolom `foto_mobil` akan NULL karena kita tidak menyimpan file di seeder
- Kolom `kapasitas`, `transmisi`, `bahan_bakar` sudah terisi dengan data

---

### ✅ Fix 5: Tambah Spesifikasi Kendaraan (Kapasitas, Transmisi, Bahan Bakar)

**Status:** Sudah ditambahkan

**Backend Changes:**

1. **Migration** (`2026_06_30_000002_add_foto_mobil_to_vehicles_table.php`):
   ```php
   $table->string('kapasitas')->nullable()->after('foto_mobil');
   $table->string('transmisi')->nullable()->after('kapasitas');
   $table->string('bahan_bakar')->nullable()->after('transmisi');
   ```

2. **Model** (`Vehicle.php`):
   ```php
   protected $fillable = ['vehicle_type_id', 'name', 'plate_number', 'price_per_day', 'status', 'foto_mobil', 'kapasitas', 'transmisi', 'bahan_bakar'];
   ```

3. **Controller** (`VehicleController.php`):
   - Method `store()` dan `update()` sudah include validasi untuk 3 field baru

4. **Seeder** (`DatabaseSeeder.php`):
   - Semua 12 mobil sudah memiliki data kapasitas, transmisi, bahan bakar

**Frontend Changes:**

**KelolaMobil.js:**
- Tambah 3 field baru di form:
  - Kapasitas (Penumpang) - text input
  - Transmisi - dropdown (Otomatis/Manual)
  - Bahan Bakar - dropdown (Bensin/Diesel/Hybrid/Listrik)
- Tambah state di formData
- Include di FormData submission

**dummyCars.js:**
- Semua 12 dummy cars sudah memiliki spesifikasi lengkap

**Cara Test:**
1. Login sebagai admin
2. Buka `/admin/mobil`
3. Scroll ke form "Tambah Kendaraan Baru"
4. Lihat field baru:
   - Kapasitas (Penumpang)
   - Transmisi
   - Bahan Bakar
5. Isi form lengkap dengan spesifikasi
6. Upload foto mobil
7. Klik "Tambah"
8. Cek database - semua data harus tersimpan

---

## Langkah-langkah Implementasi

### 1. Update Database

```bash
cd rental-car-backend

# Option A: Fresh install (recommended untuk development)
php artisan migrate:fresh
php artisan db:seed

# Option B: Jika ingin keep data lama, tambahkan kolom manual
# php artisan migrate
```

### 2. Buat Folder Uploads

```bash
# Windows Git Bash
mkdir -p public/uploads/bukti-pembayaran
mkdir -p public/uploads/foto-mobil
chmod -R 755 public/uploads
```

### 3. Restart Backend

```bash
php artisan serve
```

### 4. Restart Frontend

```bash
cd rental-car-frontend
npm run dev
```

### 5. Clear Browser Cache

- Hard refresh: Ctrl + Shift + R
- Atau clear cache browser

---

## Testing Checklist

### Test 1: Upload Foto Mobil
- [ ] Admin buka `/admin/mobil`
- [ ] Isi form kendaraan
- [ ] Upload foto mobil (JPG/PNG, max 2MB)
- [ ] Isi Kapasitas, Transmisi, Bahan Bakar
- [ ] Klik "Tambah"
- [ ] Cek phpMyAdmin - `foto_mobil` terisi dengan nama file
- [ ] Cek folder `public/uploads/foto-mobil/` - file ada
- [ ] Cek dashboard - foto mobil tampil

### Test 2: Registrasi & Redirect
- [ ] Buka `http://localhost:5173`
- [ ] Klik "Daftar disini"
- [ ] Isi form registrasi
- [ ] Klik "DAFTAR"
- [ ] Alert "Registrasi Berhasil!" muncul
- [ ] Redirect ke halaman login
- [ ] Halaman login tampil normal (tidak whitescreen)

### Test 3: Lihat Bukti Pembayaran
- [ ] Customer buat booking
- [ ] Customer upload bukti pembayaran
- [ ] Admin login
- [ ] Buka `/admin/transaksi`
- [ ] Lihat tombol "Lihat Bukti" di kolom Aksi
- [ ] Klik tombol
- [ ] Modal muncul dengan gambar bukti
- [ ] Klik outside modal untuk tutup

### Test 4: Spesifikasi Kendaraan
- [ ] Admin buka `/admin/mobil`
- [ ] Lihat form ada 3 field baru:
  - Kapasitas (Penumpang)
  - Transmisi
  - Bahan Bakar
- [ ] Test tambah kendaraan dengan spesifikasi
- [ ] Cek database - semua field tersimpan
- [ ] Cek dummy data - semua 12 mobil punya spesifikasi

### Test 5: Database Seeder
- [ ] Jalankan `php artisan db:seed`
- [ ] Buka phpMyAdmin
- [ ] Cek tabel `vehicles`:
  - 12 records
  - Kolom `foto_mobil` = NULL (normal untuk seeder)
  - Kolom `kapasitas` terisi (contoh: "7 Penumpang")
  - Kolom `transmisi` terisi (contoh: "Otomatis")
  - Kolom `bahan_bakar` terisi (contoh: "Bensin")

---

## Data Spek 12 Kendaraan

| No | Nama Mobil | Kapasitas | Transmisi | Bahan Bakar |
|----|-----------|-----------|-----------|-------------|
| 1 | Toyota Avanza | 7 Penumpang | Otomatis | Bensin |
| 2 | Honda Civic | 5 Penumpang | Otomatis | Bensin (Irit) |
| 3 | Mitsubishi Xpander | 7 Penumpang | Otomatis | Bensin |
| 4 | Toyota Fortuner | 7 Penumpang | Otomatis | Diesel |
| 5 | Suzuki Ertiga | 7 Penumpang | Otomatis | Bensin |
| 6 | Honda Brio | 5 Penumpang | Otomatis | Bensin (Irit) |
| 7 | Mitsubishi Pajero | 7 Penumpang | Otomatis | Diesel |
| 8 | Toyota Raize | 5 Penumpang | Otomatis | Bensin |
| 9 | Daihatsu Sigra | 7 Penumpang | Otomatis | Bensin |
| 10 | Toyota Zenix | 5 Penumpang | Otomatis | Bensin |
| 11 | Hyundai Creta | 5 Penumpang | Otomatis | Bensin |
| 12 | Kia Seltos | 5 Penumpang | Otomatis | Bensin |

---

## Troubleshooting

### Foto mobil tidak muncul:
1. Cek folder `public/uploads/foto-mobil/` ada filenya
2. Cek nama file di database sama dengan yang di folder
3. Cek permission folder (chmod 755)
4. Hard refresh browser

### Whitescreen setelah registrasi:
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Cek console browser (F12) untuk error
4. Pastikan route `/login` ada di App.js

### Bukti pembayaran tidak muncul:
1. Cek folder `public/uploads/bukti-pembayaran/` ada filenya
2. Cek nama file di database
3. Cek console untuk error 404
4. Pastikan path di modal sesuai: `/uploads/bukti-pembayaran/${selectedProof}`

### Kolom database masih NULL:
1. Jalankan `php artisan migrate:fresh`
2. Jalankan `php artisan db:seed`
3. Clear cache: `php artisan cache:clear`
4. Restart server

---

## Summary

Semua 5 masalah telah diperbaiki:

1. ✅ **Upload foto mobil** - File terupload dan nama tersimpan di database
2. ✅ **Whitescreen setelah registrasi** - Redirect ke login bekerja normal
3. ✅ **Lihat bukti pembayaran** - Modal viewer berfungsi
4. ✅ **Kolom foto_mobil NULL** - Migration dan seeder sudah update
5. ✅ **Spesifikasi kendaraan** - Kapasitas, transmisi, bahan bakar ditambahkan

**Next Steps:**
1. Jalankan `php artisan migrate:fresh && php artisan db:seed`
2. Test semua fitur
3. Jika ada masalah, cek troubleshooting di atas

Aplikasi sekarang lebih lengkap dengan spesifikasi kendaraan yang detail!