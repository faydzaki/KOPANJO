# KOPANJO (Kolaborasi Pengelolaan Administrasi dan Organisasi)

KOPANJO adalah aplikasi Employee Management System modern berbasis web yang dibangun dengan arsitektur terpisah (decoupled architecture):

- **Backend**: Laravel 12 RESTful API + MySQL 8 + Sanctum (`/backend`)
- **Frontend**: Next.js 15+ (TypeScript) (`/frontend`)

---

## 📁 Repository Structure

```
KOPANJO/
├── backend/                  # Laravel 12 RESTful API Backend
│   ├── app/                  # Controllers, Requests, Resources, Services, Models
│   ├── database/             # Migrations, Factories, Seeders
│   ├── postman/              # Postman API Collection & Environment
│   ├── routes/               # API routes definition
│   ├── tests/                # Automated Feature & Unit Tests
│   └── README.md             # Dokumentasi lengkap backend
├── frontend/                 # Next.js 15+ Frontend (siap diintegrasikan)
└── .gitignore                # Global gitignore
```

---

## 🚀 Memulai Backend

Petunjuk instalasi dan dokumentasi API selengkapnya dapat dilihat pada [backend/README.md](backend/README.md).

```bash
cd backend
composer install
php artisan migrate:fresh --seed
php artisan serve
```

Admin default:
- **Email**: `admin@kopanjo.test`
- **Password**: `admin123`
