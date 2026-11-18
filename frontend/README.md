# KOPANJO Frontend (Next.js 15+ & Futuristic Glassmorphism UI)

Frontend untuk **KOPANJO (Kolaborasi Pengelolaan Administrasi dan Organisasi)** — Employee Management System berbasis web dengan arsitektur modern, futuristik, dan terintegrasi penuh dengan backend RESTful API Laravel 12.

---

## 💎 Design Direction: Futuristic Glassmorphism

Aplikasi didesain dengan konsep **Futuristic Glassmorphism** yang terinspirasi dari Apple glass interface dan modern SaaS:
- **Color Palette**:
  - Deep Navy (`#0B1020`) & Midnight Blue (`#111A2E`)
  - Electric Blue (`#4F8CFF`) & Soft Violet (`#8B5CF6`)
  - Semi-transparent Glass (`rgba(255, 255, 255, 0.05 - 0.10)`)
  - Translucent Border (`rgba(255, 255, 255, 0.10)`)
  - High-contrast typography (`#F8FAFC`, `#94A3B8`)
- **Floating Sidebar Signature Design**:
  - Mengambang dengan margin dari tepi layar (`m-4`)
  - Sudut melengkung elegan (`rounded-3xl`)
  - Backdrop blur tinggi (`backdrop-filter: blur(20px)`)
  - Tombol collapse/expand desktop & responsif drawer untuk perangkat mobile
  - Indikator aktif glow electric blue
- **Data Visualizations**:
  - Gender Demographics (Recharts Donut Chart)
  - Education Level Distribution (Recharts Bar Chart)
  - Age Group Brackets Demographics (Recharts Bar Chart)

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15+ / 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS, CSS Variables, Glassmorphism utilities
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Toast Notifications**: Sonner
- **API Client**: Axios dengan Bearer Token Interceptor & Auto 401 Handler
- **Form Management**: React Hook Form
- **Form Validation**: Zod (`@hookform/resolvers/zod`)
- **Auth Storage**: Cookies (`js-cookie`) & LocalStorage

---

## 📂 Project Structure

```
frontend/
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx      # Dashboard layout wrapper
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx    # Dashboard overview & real-time analytics
│   │   │   └── employees/
│   │   │       ├── page.tsx    # Daftar pegawai, search, filter, pagination
│   │   │       ├── create/
│   │   │       │   └── page.tsx# Form tambah pegawai baru
│   │   │       └── [id]/
│   │   │           ├── page.tsx# Detail profil lengkap pegawai
│   │   │           └── edit/
│   │   │               └── page.tsx # Form edit data pegawai
│   │   ├── login/
│   │   │   └── page.tsx        # Halaman autentikasi futuristik
│   │   ├── globals.css         # Glassmorphism utilities & ambient glow
│   │   ├── layout.tsx          # Root layout & Auth/Toast provider
│   │   └── page.tsx            # Root redirector (/dashboard or /login)
│   ├── components/
│   │   ├── dashboard/          # StatCard, GenderDonutChart, EducationBarChart, AgeBarChart, RecentEmployeesTable
│   │   ├── employees/          # EmployeeForm (reusable), DeleteConfirmationDialog
│   │   ├── layout/             # Sidebar (floating), Topbar, DashboardLayout
│   │   └── ui/                 # Button, Input, Badge, Card, Modal, Skeleton
│   ├── lib/
│   │   ├── api.ts              # Axios instance & interceptors
│   │   ├── auth.ts             # Token cookie & session storage helpers
│   │   └── utils.ts            # Formatting & utility functions
│   ├── providers/
│   │   └── auth-provider.tsx   # React Auth Context & session management
│   ├── services/
│   │   ├── auth.service.ts     # Auth endpoints (/login, /me, /logout)
│   │   ├── employee.service.ts # Employee CRUD endpoints (/employees)
│   │   └── dashboard.service.ts# Dashboard endpoints (/dashboard/*)
│   └── types/
│       └── index.ts            # TypeScript interfaces & API types
└── .env.example                # Environment variables template
```

---

## 🚀 Panduan Menjalankan Frontend

### 1. Masuk ke direktori frontend
```bash
cd frontend
```

### 2. Instal dependencies
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Isi konten `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

### 4. Jalankan Server Development
```bash
npm run dev
```
Aplikasi frontend akan berjalan di `http://localhost:3000`.

### 5. Kompilasi Produksi (Production Build)
```bash
npm run build
npm start
```

---

## 🔑 Demo Kredensial Admin

Untuk masuk ke aplikasi, gunakan kredensial demo default:
- **Email**: `admin@kopanjo.test`
- **Password**: `admin123`

*(Tersedia tombol satu-klik **Auto-fill** pada halaman Login)*

---

## 📡 Integrasi Backend Laravel

Frontend terhubung langsung dengan backend RESTful API Laravel 12:
- **POST `/api/login`**: Autentikasi admin, token disimpan di cookie via `js-cookie`.
- **GET `/api/me`**: Verifikasi sesi admin saat aplikasi dimuat.
- **POST `/api/logout`**: Mengakhiri sesi dan membersihkan token.
- **GET `/api/dashboard/statistics`**: Total pegawai, rasio gender, dan jumlah pendidikan.
- **GET `/api/dashboard/gender`**: Komposisi gender & persentase.
- **GET `/api/dashboard/education`**: Distribusi jenjang pendidikan pegawai.
- **GET `/api/dashboard/age`**: Pengelompokan umur (<25, 25–35, 36–45, 46–55, >55).
- **GET `/api/employees`**: Paginasi, pencarian nama/NIP, filter gender/pendidikan/jabatan, dan sorting.
- **POST `/api/employees`**: Penambahan pegawai baru dengan validasi Zod & Laravel Form Request.
- **GET `/api/employees/{id}`**: Mengambil detail profil pegawai.
- **PUT `/api/employees/{id}`**: Memperbarui data pegawai.
- **DELETE `/api/employees/{id}`**: Menghapus data pegawai setelah konfirmasi modal.
