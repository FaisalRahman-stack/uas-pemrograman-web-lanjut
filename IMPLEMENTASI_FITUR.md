# Panduan Implementasi 5 Fitur Rentix Privé

## Ringkasan Fitur yang Diimplementasikan

### ✅ Feature 1: Upload Bukti Pembayaran (Sisi Customer)
### ✅ Feature 2: Status Transaksi "disetujui" & "menunggu" (Sisi Admin)
### ✅ Feature 3: Connect Register Link to Login Page
### ✅ Feature 4: Form Upload Gambar Mobil (Sisi Admin)
### ✅ Feature 5: Counter Jumlah Mobil di Katalog Customer

---

## Feature 1: Upload Bukti Pembayaran

### Backend Changes

#### 1.1 Migration File
**File:** `rental-car-backend/database/migrations/2026_06_30_000001_add_bukti_pembayaran_to_rentals_table.php`
- Menambahkan kolom `bukti_pembayaran` (string, nullable) ke tabel rentals

#### 1.2 Model Update
**File:** `rental-car-backend/app/Models/Rental.php`
- Menambahkan `'bukti_pembayaran'` ke dalam `$fillable`

#### 1.3 Controller Update
**File:** `rental-car-backend/app/Http/Controllers/Api/V1/RentalController.php`
- Menambahkan method `uploadProof()` untuk handle upload bukti pembayaran
- Validasi: file harus image (jpeg, jpg, png) max 2MB
- Simpan file ke folder `public/uploads/bukti-pembayaran/`
- Update kolom `bukti_pembayaran` dengan nama file

#### 1.4 Routes Update
**File:** `rental-car-backend/routes/api.php`
- Route: `POST /rentals/{rental}/upload-proof` → `RentalController@uploadProof`

### Frontend Changes

**File:** `rental-car-frontend/src/pages/RentalForm.js`

#### Fitur yang ditambahkan:
1. State baru: `buktiPembayaran` dan `rentalId`
2. Setelah transaksi berhasil, simpan `rentalId` dan tampilkan form upload
3. Form upload dengan validasi:
   - Format: .jpg, .jpeg, .png
   - Ukuran max: 2MB
4. Mutation `uploadMutation` untuk upload file menggunakan FormData
5. Tampilkan nama file yang dipilih dan status upload

### Cara Penggunaan:
1. Customer mengisi form rental dan klik "Konfirmasi Sewa"
2. Setelah transaksi berhasil, form upload bukti pembayaran muncul
3. Customer pilih file bukti transfer (JPG/PNG, max 2MB)
4. Klik "Upload Bukti Pembayaran"
5. File terupload ke server dan disimpan di database

---

## Feature 2: Status Transaksi "disetujui" & "menunggu"

### Backend Changes

#### 2.1 Migration Update
**File:** `rental-car-backend/database/migrations/2026_06_21_133744_create_rentals_table.php`
- Update enum status dari `['pending', 'confirmed', 'ongoing', 'completed', 'cancelled']`
- Menjadi: `['menunggu', 'disetujui', 'completed', 'cancelled']`
- Default status: `'menunggu'`

#### 2.2 Controller Update
**File:** `rental-car-backend/app/Http/Controllers/Api/V1/RentalController.php`
- Menambahkan method `updateStatus()` untuk update status transaksi
- Validasi: status harus salah satu dari `menunggu`, `disetujui`, `completed`, `cancelled`

#### 2.3 Routes Update
**File:** `rental-car-backend/routes/api.php`
- Route: `PATCH /rentals/{rental}/update-status` → `RentalController@updateStatus`

### Frontend Changes

**File:** `rental-car-frontend/src/pages/admin/KelolaTransaksi.js`

#### Fitur yang ditambahkan:
1. Update status badge dengan warna yang sesuai:
   - **Menunggu**: Kuning (bg-yellow-200)
   - **Disetujui**: Hijau (bg-green-200)
   - **Selesai**: Biru (bg-blue-200)
   - **Dibatalkan**: Merah (bg-red-200)
2. Update dropdown status dengan opsi baru:
   - Menunggu
   - Disetujui
   - Selesai
   - Tolak
3. Ubah method API dari `PUT` ke `PATCH` ke endpoint `/update-status`

### Cara Penggunaan:
1. Admin buka halaman "Kelola Transaksi"
2. Setiap transaksi menampilkan status dengan badge berwarna
3. Admin bisa mengubah status melalui dropdown:
   - **Menunggu**: Status default setelah customer checkout
   - **Disetujui**: Setelah admin verifikasi bukti pembayaran
   - **Selesai**: Transaksi selesai
   - **Tolak**: Transaksi ditolak

---

## Feature 3: Connect Register Link to Login Page

### Frontend Changes

**File:** `rental-car-frontend/src/pages/Login.js`

#### Status: ✅ SUDAH TERHUBUNG

Link "Daftar disini" sudah terhubung menggunakan `react-router-dom` Link:

```jsx
<Link to="/register" className="cursor-pointer hover:underline font-bold">
    Daftar disini
</Link>
```

### Cara Penggunaan:
1. User buka halaman Login (localhost:5173)
2. Scroll ke bawah, ada teks "Tidak punya akun? Daftar disini"
3. Klik "Daftar disini" akan navigasi ke halaman Register

---

## Feature 4: Form Upload Gambar Mobil

### Backend Changes

#### 4.1 Migration File
**File:** `rental-car-backend/database/migrations/2026_06_30_000002_add_foto_mobil_to_vehicles_table.php`
- Menambahkan kolom `foto_mobil` (string, nullable) ke tabel vehicles

#### 4.2 Model Update
**File:** `rental-car-backend/app/Models/Vehicle.php`
- Menambahkan `'foto_mobil'` ke dalam `$fillable`

#### 4.3 Controller Update
**File:** `rental-car-backend/app/Http/Controllers/Api/V1/VehicleController.php`

**Method `store()`:**
- Validasi file: `nullable|image|mimes:jpeg,jpg,png|max:2048`
- Jika ada file upload, simpan ke `public/uploads/foto-mobil/`
- Simpan nama file ke kolom `foto_mobil`

**Method `update()`:**
- Sama seperti store, support upload foto baru
- File disimpan dengan timestamp untuk menghindari nama duplikat

### Frontend Changes

**File:** `rental-car-frontend/src/pages/admin/KelolaMobil.js`

#### Fitur yang ditambahkan:
1. State baru: `fotoMobil` di formData
2. Input file baru "Unggah Foto Mobil" di bawah field "Nomor Plat"
3. Validasi file:
   - Format: .jpg, .jpeg, .png
   - Ukuran max: 2MB
4. Handler `handleFileChange()` untuk handle file selection
5. Ubah submission menjadi `FormData` (multipart/form-data)
6. Tampilkan nama file yang dipilih

### Cara Penggunaan:
1. Admin buka halaman "Tambah Kendaraan Baru" (/admin/mobil)
2. Isi form: Nama Mobil, Merek, Tipe, Nomor Plat, Tarif
3. Di bawah field "Nomor Plat", ada input "Unggah Foto Mobil"
4. Pilih file gambar (JPG/PNG, max 2MB)
5. Klik "Tambah" atau "Simpan"
6. File terupload dan nama file tersimpan di database

---

## Feature 5: Counter Jumlah Mobil di Katalog Customer

### Frontend Changes

**File:** `rental-car-frontend/src/pages/Dashboard.js`

#### Status: ✅ SUDAH DINAMIS

Counter sudah menggunakan data dinamis dari state:

```jsx
<p className="text-gray-700 text-sm">
    Menampilkan {cars.length > 0 ? indeksPertama + 1 : 0} - {Math.min(indeksTerakhir, cars.length)} dari {cars.length} hasil
</p>
```

#### Cara Kerja:
1. `cars` diambil dari Zustand store: `const cars = useRentalStore((state) => state.cars);`
2. Data berasal dari:
   - **Primary**: API backend (`/vehicles`)
   - **Fallback**: Dummy data (`dummyCars.js`)
3. Counter menampilkan:
   - `indeksPertama + 1`: Mulai dari (dengan pagination)
   - `Math.min(indeksTerakhir, cars.length)`: Sampai dengan
   - `cars.length`: Total hasil

### Cara Penggunaan:
1. Customer buka halaman Dashboard (/dashboard)
2. Bagian header menampilkan: "Menampilkan 1 - 8 dari 12 hasil" (contoh)
3. Angka akan berubah sesuai:
   - Jumlah total mobil di database/dummy data
   - Halaman aktif (pagination)

---

## Langkah-langkah Menjalankan Aplikasi

### Backend (Laravel)

1. **Jalankan Migration:**
   ```bash
   cd rental-car-backend
   php artisan migrate
   ```

2. **Buat Folder Uploads (jika belum ada):**
   ```bash
   mkdir -p public/uploads/bukti-pembayaran
   mkdir -p public/uploads/foto-mobil
   ```

3. **Set Permission (Linux/Mac):**
   ```bash
   chmod -R 755 public/uploads
   ```

4. **Jalankan Server:**
   ```bash
   php artisan serve
   ```
   Server akan berjalan di `http://localhost:8000`

### Frontend (React + Vite)

1. **Install Dependencies (jika belum):**
   ```bash
   cd rental-car-frontend
   npm install
   ```

2. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Server akan berjalan di `http://localhost:5173`

---

## Testing Fitur

### Test Feature 1: Upload Bukti Pembayaran
1. Login sebagai customer
2. Pilih mobil dan lakukan penyewaan
3. Setelah transaksi dibuat, form upload muncul
4. Upload file gambar (JPG/PNG, max 2MB)
5. Cek di database: kolom `bukti_pembayaran` terisi
6. Cek folder: `public/uploads/bukti-pembayaran/` ada filenya

### Test Feature 2: Status Transaksi
1. Login sebagai admin
2. Buka "Kelola Transaksi"
3. Lihat badge status dengan warna berbeda
4. Ganti status menggunakan dropdown
5. Cek API response dan database update

### Test Feature 3: Register Link
1. Buka `http://localhost:5173`
2. Lihat halaman login
3. Klik "Daftar disini" di bawah form
4. Harus navigasi ke halaman register

### Test Feature 4: Upload Gambar Mobil
1. Login sebagai admin
2. Buka "Tambah Kendaraan Baru" (/admin/mobil)
3. Isi form kendaraan
4. Di bawah "Nomor Plat", upload foto mobil
5. Klik "Tambah"
6. Cek folder: `public/uploads/foto-mobil/` ada filenya
7. Cek database: kolom `foto_mobil` terisi

### Test Feature 5: Counter Mobil
1. Buka halaman dashboard sebagai customer
2. Lihat text "Menampilkan X - Y dari Z hasil"
3. Ganti halaman (pagination)
4. Angka harus berubah sesuai data yang ditampilkan

---

## Catatan Penting

### File Upload Path
- Bukti Pembayaran: `public/uploads/bukti-pembayaran/`
- Foto Mobil: `public/uploads/foto-mobil/`

### Validasi File
- Format: JPG, JPEG, PNG
- Ukuran maksimal: 2MB

### Status Transaksi
- `menunggu`: Default setelah customer checkout
- `disetujui`: Setelah admin verifikasi bukti pembayaran
- `completed`: Transaksi selesai
- `cancelled`: Transaksi ditolak/dibatalkan

### API Endpoints Baru
```
POST   /v1/rentals/{rental}/upload-proof    → Upload bukti pembayaran
PATCH  /v1/rentals/{rental}/update-status   → Update status transaksi
```

---

## Troubleshooting

### Error: "Class not found" saat migration
```bash
composer dump-autoload
php artisan migrate
```

### Error: Permission denied saat upload
```bash
# Windows (Git Bash)
chmod -R 755 public/uploads

# Atau jalankan CMD sebagai Administrator
```

### Error: CORS atau 404 di API
- Pastikan backend berjalan di port 8000
- Cek `apiClient.js` base URL sesuai dengan backend URL
- Cek routes di `routes/api.php` sudah benar

### File tidak terupload
- Cek folder `public/uploads/` sudah dibuat
- Cek permission folder
- Cek `php.ini` setting `upload_max_filesize` dan `post_max_size` minimal 2M

---

## Kesimpulan

Semua 5 fitur telah berhasil diimplementasikan dengan baik:

1. ✅ Upload Bukti Pembayaran - Full stack (backend + frontend)
2. ✅ Status Transaksi - Full stack dengan UI yang lebih informatif
3. ✅ Register Link - Sudah terhubung (tidak perlu perubahan)
4. ✅ Upload Gambar Mobil - Full stack dengan FormData
5. ✅ Counter Mobil - Sudah dinamis menggunakan state

Aplikasi siap untuk di-test dan digunakan!