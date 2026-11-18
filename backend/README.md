# KOPANJO Backend (Laravel 12 RESTful API)

**KOPANJO (Kolaborasi Pengelolaan Administrasi dan Organisasi)** adalah Employee Management System berbasis web yang dirancang untuk membantu organisasi dan perusahaan mengelola data pegawai, menyajikan data analitik demografis dan statistik kepegawaian secara real-time, serta terintegrasi penuh via REST API.

---

## 🛠️ Technology Stack

- **Framework**: Laravel 12.x
- **Bahasa**: PHP 8.2+ (Teruji pada PHP 8.4)
- **Database**: MySQL 8.0+
- **Autentikasi**: Laravel Sanctum (Bearer Token)
- **Validasi**: Laravel Form Request
- **Serialisasi**: Laravel API Resources
- **Testing**: PHPUnit / Laravel Feature Testing
- **API Documentation**: Postman Collection v2.1.0

---

## 📂 Backend Architecture

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php        # Otentikasi Sanctum (Login, Me, Logout)
│   │   │       ├── EmployeeController.php    # CRUD, Search, Filter, Sort, Pagination
│   │   │       └── DashboardController.php   # Agregasi Dashboard Real-time
│   │   ├── Requests/
│   │   │   ├── LoginRequest.php              # Validasi Kredensial Admin
│   │   │   ├── StoreEmployeeRequest.php      # Validasi Penambahan Pegawai
│   │   │   └── UpdateEmployeeRequest.php     # Validasi Pembaruan Pegawai
│   │   └── Resources/
│   │       ├── EmployeeResource.php          # Serialisasi Data Pegawai
│   │       └── UserResource.php              # Serialisasi Data Admin
│   ├── Models/
│   │   ├── User.php                          # Model Admin (HasApiTokens)
│   │   └── Employee.php                      # Model Pegawai & Date Casting
│   └── Services/
│       └── DashboardService.php              # Logika Agregasi SQL Statistik & Demografi
├── config/
│   ├── cors.php                              # Konfigurasi CORS untuk Next.js
│   └── sanctum.php                           # Konfigurasi Token Sanctum
├── database/
│   ├── factories/
│   │   └── EmployeeFactory.php               # Generator Dummy Pegawai Realistis
│   ├── migrations/
│   │   ├── ..._create_users_table.php
│   │   ├── ..._create_personal_access_tokens_table.php
│   │   └── ..._create_employees_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── UserSeeder.php                    # Demo Admin Seeder
│       └── EmployeeSeeder.php                # 35 Data Pegawai Berbagai Kategori
├── postman/
│   ├── KOPANJO_API.postman_collection.json   # Postman Collection v2.1
│   └── KOPANJO_Environment.postman_environment.json
├── routes/
│   └── api.php                               # Definisi Rute RESTful API
└── tests/
    └── Feature/
        ├── AuthTest.php                      # 6 Test Autentikasi
        ├── EmployeeTest.php                  # 11 Test CRUD Pegawai
        └── DashboardTest.php                 # 6 Test Dashboard Analytics
```

---

## ⚙️ Persyaratan Sistem

- PHP >= 8.2 (ekstensi aktif: `pdo_mysql`, `mbstring`, `openssl`, `curl`, `json`)
- Composer >= 2.0
- MySQL Server >= 8.0

---

## 🚀 Panduan Instalasi & Setup

### 1. Masuk ke direktori backend
```bash
cd backend
```

### 2. Instal dependensi Composer (jika belum)
```bash
composer install
```

### 3. Salin dan sesuaikan Environment Variables
```bash
cp .env.example .env
php artisan key:generate
```

Pastikan variabel database pada `.env` telah disesuaikan:
```env
APP_NAME=KOPANJO
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kopanjo_db
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Buat Database MySQL
```sql
CREATE DATABASE IF NOT EXISTS kopanjo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Jalankan Migration dan Seeder
```bash
php artisan migrate:fresh --seed
```

Command di atas akan:
- Membuat tabel `users`, `personal_access_tokens`, dan `employees`.
- Mengisi akun admin demo.
- Mengisi 35 data pegawai dengan distribusi realistis (gender, pendidikan, rentang usia 20–60 tahun, dan berbagai jabatan).

### 6. Jalankan Server Development
```bash
php artisan serve
```
Server backend akan berjalan di `http://127.0.0.1:8000`.

---

## 🔑 Kredensial Demo Admin

- **Email**: `admin@kopanjo.test`
- **Password**: `admin123`

---

## 📡 Daftar Endpoint API

### Standard Response Format

**Success Response (200 / 201):**
```json
{
  "success": true,
  "message": "Pesan keberhasilan",
  "data": {}
}
```

**Error / Validation Response (401 / 404 / 422):**
```json
{
  "success": false,
  "message": "Pesan kesalahan",
  "errors": {}
}
```

---

### 1. Autentikasi (Sanctum)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/api/login` | Publik | Login admin, mengembalikan Bearer Token |
| `GET` | `/api/me` | Bearer Token | Mengambil detail profil admin aktif |
| `POST` | `/api/logout` | Bearer Token | Menghapus token aktif (logout) |

#### Contoh Request Login:
```json
POST /api/login
Content-Type: application/json

{
  "email": "admin@kopanjo.test",
  "password": "admin123"
}
```

---

### 2. Employee Management (CRUD)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/api/employees` | Bearer Token | Daftar pegawai (Search, Filter, Sort, Paginate) |
| `POST` | `/api/employees` | Bearer Token | Tambah pegawai baru |
| `GET` | `/api/employees/{id}` | Bearer Token | Detail pegawai berdasarkan ID |
| `PUT` | `/api/employees/{id}` | Bearer Token | Perbarui data pegawai |
| `DELETE` | `/api/employees/{id}` | Bearer Token | Hapus data pegawai |

#### Query Parameters pada `GET /api/employees`:
- `page` *(int)*: Nomor halaman (default: `1`).
- `per_page` *(int)*: Data per halaman (default: `10`, max: `100`).
- `search` *(string)*: Pencarian nama pegawai atau NIP.
- `jenis_kelamin` *(string)*: Filter `Laki-laki` atau `Perempuan`.
- `pendidikan_terakhir` *(string)*: Filter `SMA/SMK`, `D3`, `S1`, `S2`.
- `jabatan` *(string)*: Filter berdasarkan nama jabatan.
- `sort_by` *(string)*: Kolom sorting (`nama`, `tanggal_masuk`, `tanggal_lahir`, `nip`, `created_at`, `id`).
- `sort_order` *(string)*: Urutan (`asc` atau `desc`).

Contoh:
```
GET /api/employees?page=1&per_page=10&search=andi&jenis_kelamin=Laki-laki&sort_by=nama&sort_order=asc
```

---

### 3. Dashboard Analytics

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/api/dashboard/statistics` | Bearer Token | Total pegawai, total gender, dan pendidikan |
| `GET` | `/api/dashboard/gender` | Bearer Token | Komposisi gender, jumlah, & persentase |
| `GET` | `/api/dashboard/education` | Bearer Token | Distribusi tingkat pendidikan pegawai |
| `GET` | `/api/dashboard/age` | Bearer Token | Distribusi kelompok usia (<25, 25–35, 36–45, 46–55, >55) |

---

## 🧪 Automated Testing

Backend dilengkapi dengan test suite lengkap (25 tests, 232 assertions) mencakup Auth, CRUD Pegawai, dan Dashboard Analytics.

Jalankan seluruh test:
```bash
php artisan test
```

Jalankan test spesifik:
```bash
php artisan test --filter=AuthTest
php artisan test --filter=EmployeeTest
php artisan test --filter=DashboardTest
```

---

## 📬 Postman Collection

Collection dan Environment Postman tersedia di direktori `postman/`:
- `postman/KOPANJO_API.postman_collection.json`
- `postman/KOPANJO_Environment.postman_environment.json`

**Cara Pakai di Postman:**
1. Import kedua file di atas ke aplikasi Postman.
2. Pilih environment **KOPANJO Local Environment**.
3. Jalankan request **Login Admin** — test script akan secara otomatis menyimpan token baru ke variabel environment `{{token}}`.
4. Anda dapat langsung menjalankan seluruh request CRUD dan Dashboard tanpa copy-paste token manual.

---

## 🌐 Integrasi dengan Frontend Next.js 15+

1. **CORS**: Sudah dikonfigurasikan di `config/cors.php`. Diatur untuk membaca `FRONTEND_URL` (default: `http://localhost:3000`).
2. **Bearer Token**: Setiap request dari Next.js ke endpoint yang terproteksi wajib menyertakan header:
   ```
   Authorization: Bearer <TOKEN_HASIL_LOGIN>
   Accept: application/json
   ```
3. **Penyimpanan Token di Next.js**: Simpan token pada `httpOnly` cookie atau state client (misalnya Zustand / React Context / NextAuth session) untuk diteruskan ke backend API.
