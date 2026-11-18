# KOPANJO (Kolaborasi Pengelolaan Administrasi dan Organisasi)

**KOPANJO** adalah aplikasi Employee Management System enterprise berbasis web dengan arsitektur modern terpisah (*decoupled architecture*):

- **Backend**: Laravel 12 + PHP 8.4 + MySQL 8 + Laravel Sanctum RESTful API (`/backend`)
- **Frontend**: Next.js 15+ / 16 + TypeScript + Tailwind CSS + Futuristic Glassmorphism UI (`/frontend`)

---

## 🏛️ Arsitektur Aplikasi

```
KOPANJO/
├── backend/                       # Laravel 12 RESTful API
│   ├── app/                       # Controllers, Requests, Resources, Services, Models
│   ├── database/                  # Migrations, Factories, Seeders (35 Demo Employees)
│   ├── postman/                   # Postman Collection & Environment v2.1.0
│   ├── routes/                    # API routes definition
│   ├── tests/                     # 25 Automated Feature & Unit Tests (100% Pass)
│   └── README.md                  # Dokumentasi teknis backend
├── frontend/                      # Next.js 15+ Futuristic Glassmorphism UI
│   ├── src/app/                   # App Router: Login, Dashboard, Employees CRUD
│   ├── src/components/            # Floating Sidebar, Topbar, Recharts, Forms, UI Kit
│   ├── src/services/              # Axios API Services (Auth, Employee, Dashboard)
│   ├── src/lib/                   # API client, Auth token cookies, utils
│   └── README.md                  # Dokumentasi teknis frontend
└── .gitignore                     # Monorepo ignore rules
```

---

## 🚀 Panduan Memulai Cepat (Quick Start)

### 1. Menjalankan Backend (Laravel 12)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Sesuaikan konfigurasi database MySQL di .env (DB_DATABASE=kopanjo_db)
php artisan migrate:fresh --seed
php artisan serve
```
Backend berjalan pada: `http://127.0.0.1:8000`

### 2. Menjalankan Frontend (Next.js 15+)
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```
Frontend berjalan pada: `http://localhost:3000`

---

## 🔑 Kredensial Demo Admin Default

- **Email**: `admin@kopanjo.test`
- **Password**: `admin123`

---

## ✨ Fitur Utama

1. **Futuristic Glassmorphism Interface**:
   - Palette warna Deep Navy (`#0B1020`), Midnight Blue (`#111A2E`), Electric Blue (`#4F8CFF`), dan Soft Violet (`#8B5CF6`).
   - Floating Sidebar khas yang mengambang, collapsible, dan responsif menjadi drawer di layar mobile.
   - Efek frosted glass, backdrop blur, dan ambient lighting.
2. **Dashboard Analytics Real-Time**:
   - 4 Kartu Statistik: Total Pegawai, Pegawai Laki-laki, Pegawai Perempuan, Kategori Pendidikan.
   - 3 Visualisasi Interaktif Recharts: Gender Donut Chart, Education Bar Chart, Age Demographics Bar Chart (<25, 25–35, 36–45, 46–55, >55).
   - Tabel Pegawai Terbaru.
3. **Manajemen Pegawai Lengkap (CRUD)**:
   - Pencarian real-time berdasarkan Nama atau NIP.
   - Filter multivariat: Jenis Kelamin, Tingkat Pendidikan, dan Jabatan.
   - Paginasi dinamis dan pengurutan (Sorting).
   - Tambah & Edit Pegawai dengan validasi ganda (Zod di frontend & Form Request di backend).
   - Detail Profil Pegawai lengkap dengan kalkulasi usia otomatis.
   - Konfirmasi Hapus Pegawai dengan dialog modal glassmorphism.
4. **Keamanan & Autentikasi**:
   - Laravel Sanctum Bearer Token.
   - Penyimpanan token aman berbasis cookie (`js-cookie`).
   - Route guard dan auto-redirect ketika sesi kedaluwarsa (401).
