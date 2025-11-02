# Indian Mithai Shop Management System

A full‑stack Sweet Shop (Mithai) management system built as a TDD kata.

- Backend: Node.js + Express + TypeScript + Prisma (SQLite), JWT auth, role-based access (ADMIN/USER).
- Frontend: React + Vite + TypeScript.
- Price currency: Indian Rupees (₹, INR).
- Seeded with popular Indian mithai (Gulab Jamun, Jalebi, Kaju Katli, etc.).
- Purchase is atomic: stock never goes below zero.

Admin credentials (seeded)
- Email: admin@example.com
- Password: Admin123!

## Contents

- Features
- Tech stack and structure
- Quick start (Windows/macOS/Linux)
- API endpoints
- Running tests
- Environment variables
- Common issues / troubleshooting
- Switching DB to Postgres (optional)
- My AI Usage (required by assignment)
- License

---

## Features

Backend (REST)
- User registration and login (JWT).
- Role-based authorization (ADMIN/USER).
- Sweets (Mithai) CRUD for admins.
- Inventory actions:
  - Purchase (decrement stock).
  - Restock (increment stock, admin only).
- Search by name/category/price range (empty filters allowed).
- SQLite database via Prisma (file-based; no server needed).

Frontend (SPA)
- Register / Login forms.
- Dashboard lists all mithai and supports search/filter.
- Purchase button disabled when quantity is 0.
- Admin screen to add, edit, delete, and restock mithai.
- Prices formatted as INR using Indian locale.

---

## Tech stack and structure

sweet-shop/
├─ backend/ # Node.js + Express + TypeScript + Prisma
│ ├─ prisma/ # Prisma schema + seed (Indian mithai)
│ ├─ src/
│ │ ├─ routes/ # auth.routes.ts, sweets.routes.ts
│ │ ├─ tests/ # Jest + Supertest
│ │ └─ ...
│ └─ .env.example
└─ frontend/ # React + Vite + TypeScript
└─ src/
├─ pages/ # Dashboard, Admin, Login, Register
├─ utils/ # currency.ts (INR formatter)
└─ api.ts


Key libraries
- Backend: express, jsonwebtoken, zod, prisma, bcryptjs, jest, supertest.
- Frontend: react, react-router-dom, vite.




![alt text](<Screenshot 2025-11-02 193922.png>) ![alt text](<Screenshot 2025-11-02 193959.png>) ![alt text](<Screenshot 2025-11-02 194116.png>) ![alt text](<Screenshot 2025-11-02 194145.png>) ![alt text](<Screenshot 2025-11-02 194315.png>) ![alt text](<Screenshot 2025-11-02 194402.png>)



Login with:
- admin@example.com / Admin123!

Use the app:
- Dashboard: browse/search mithai; purchase.
- Admin: add/edit/delete/restock mithai.

---

## API endpoints

Base URL: http://localhost:4000

Auth
- POST /api/auth/register
  - body: { name, email, password }
- POST /api/auth/login
  - body: { email, password }
  - returns: { token, user }

Sweets (public reads)
- GET /api/sweets
- GET /api/sweets/search?name=&category=&minPrice=&maxPrice=
  - All filters optional; empty filters are ignored.

Sweets (admin only for writes)
- POST /api/sweets
  - body: { name, category, price, quantity }
- PUT /api/sweets/:id
  - body: any of { name, category, price, quantity }
- DELETE /api/sweets/:id

Inventory
- POST /api/sweets/:id/purchase        (auth required)
  - body: { quantity: number > 0 }
- POST /api/sweets/:id/restock         (admin)
  - body: { quantity: number > 0 }

Notes
- price is a number in INR (Float in SQLite).
- purchase uses an atomic update; fails if insufficient stock.

