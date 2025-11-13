# Indian Mithai Shop – Frontend‑first SPA

A modern, attractive single‑page application (SPA) that showcases an Indian sweet (mithai) catalogue with search, filters, images, and smooth UI polish. The app also includes an Admin area to manage items. Backend is a simple Node/Express API (already wired) and requires only a few commands to run.

Focus: Frontend (React + Vite + TypeScript, HTML/CSS/JS)

Admin credentials (seeded)
- Email: admin@example.com
- Password: Admin123!

---

## What makes the UI engaging

- Clean, responsive “glass” design with gradient background.
- Grid cards for mithai with image, category badge, INR price, stock, and CTA.
- Image system with 3‑level fallback:
  1) Local images from /public/mithai (fast and reliable),
  2) Remote images (Wikipedia/Unsplash) if local is missing,
  3) A colorful SVG placeholder with the mithai name (never shows a broken image).
- Subtle animations and hover effects with pure CSS (no heavy UI framework).
- INR currency formatting using Indian locale.
- Search & filter toolbar (name, category, min/max price).
- Skeleton loaders and friendly empty states.

---

## Frontend tech stack

- React 18, Vite, TypeScript
- Plain CSS (frontend/src/styles.css)
- Routing with react-router-dom
- Utility helpers:
  - src/utils/currency.ts – INR formatting
  - src/assets/imageMap.ts – local/remote/placeholder image resolver
- Components:
  - src/components/SweetCard.tsx – mithai card on the dashboard
  - src/components/AdminSweetCard.tsx – mithai card in Admin panel
  - src/components/SearchBar.tsx – search and filter controls
  - src/components/Skeleton.tsx – grid skeleton while loading
- Pages:
  - src/pages/Dashboard.tsx – catalogue with search/filter/purchase
  - src/pages/Admin.tsx – add/edit/delete/restock (admin only)
  - src/pages/Login.tsx, src/pages/Register.tsx
- State:
  - src/useAuth.tsx – very small auth context (stores JWT and user)

Optional images
- Place JPGs under: frontend/public/mithai/
- Recommended names (match these so cards pick them automatically):
  - gulab-jamun.jpg, jalebi.jpg, rasgulla.jpg, kaju-katli.jpg, besan-ladoo.jpg,
    barfi.jpg, rasmalai.jpg, soan-papdi.jpg, peda.jpg, sandesh.jpg
- If you don’t add local images, the app falls back to remote photos; if blocked, it shows a nice SVG placeholder with the mithai name.

---

## Quick start

Prerequisites
- Node.js 18+ (includes npm)
- Tip for Windows PowerShell: if you see “npm.ps1 cannot be loaded…”, use `npm.cmd` instead of `npm` in all commands below.

### 1) Start the backend (simple)

Open a terminal in `sweet-shop/backend`:

Copy-Item .env.example .env # (CMD: copy .env.example .env)
npm.cmd install
npm.cmd run db:migrate
npm.cmd run db:seed # seeds Indian mithai + admin user
npm.cmd run dev # API runs at http://localhost:4000


That’s all you need on the backend.

Health check: http://localhost:4000/api/health → {"status":"ok"}

### 2) Start the frontend (main focus)

Open a second terminal in `sweet-shop/frontend`:

npm.cmd install

cmd /c "echo VITE_API_URL=http://localhost:4000 > .env"
npm.cmd run dev # App runs at http://localhost:5173


Open http://localhost:5173

Login as Admin (above) to see the Admin page and management actions.

---

## Using the app

- Dashboard
  - Browse all mithai in a responsive grid.
  - Search by name (e.g., “gulab”), category (e.g., “Bengali”), min/max price in ₹.
  - Purchase button buys quantity 1 and is disabled when stock is 0.

- Admin (admin@example.com / Admin123!)
  - Add new mithai: name, category, price (₹), quantity.
  - Edit existing items (name/category/price).
  - Restock (increase quantity).
  - Delete items.

---

## Minimal backend reference (for completeness)

API base: http://localhost:4000

- POST /api/auth/register – { name, email, password }
- POST /api/auth/login – { email, password } → { token, user }
- GET /api/sweets – list all
- GET /api/sweets/search?name=&category=&minPrice=&maxPrice= – all filters optional
- POST /api/sweets – admin only
- PUT /api/sweets/:id – admin only
- DELETE /api/sweets/:id – admin only
- POST /api/sweets/:id/purchase – auth required
- POST /api/sweets/:id/restock – admin only

Price is stored as a number (INR). Purchase is atomic (stock never goes negative).

---

## Project structure (frontend‑first)

sweet-shop/
├─ frontend/
│ ├─ public/
│ │ └─ mithai/ # optional local images (jpg)
│ └─ src/
│ ├─ assets/
│ │ └─ imageMap.ts # local → remote → placeholder image logic
│ ├─ components/
│ │ ├─ AdminSweetCard.tsx
│ │ ├─ SearchBar.tsx
│ │ ├─ Skeleton.tsx
│ │ └─ SweetCard.tsx
│ ├─ pages/
│ │ ├─ Admin.tsx
│ │ ├─ Dashboard.tsx
│ │ ├─ Login.tsx
│ │ └─ Register.tsx
│ ├─ utils/currency.ts
│ ├─ api.ts # tiny fetch wrapper
│ ├─ App.tsx
│ ├─ main.tsx
│ └─ styles.css # full custom theme (no UI framework)
└─ backend/ # simple Node/Express API (unchanged)

![alt text](<Screenshot 2025-11-13 154613.png>) ![alt text](<Screenshot 2025-11-13 155455.png>) ![alt text](<Screenshot 2025-11-13 154146.png>) ![alt text](<Screenshot 2025-11-13 154221.png>) ![alt text](<Screenshot 2025-11-13 154350.png>) ![alt text](<Screenshot 2025-11-13 154447.png>) ![alt text](<Screenshot 2025-11-13 154519.png>) ![alt text](<Screenshot 2025-11-13 154534.png>)



---

## Troubleshooting

- White screen
  - Open DevTools → Console for errors.
  - Ensure the backend is running at http://localhost:4000 (or update frontend .env VITE_API_URL).
  - Hard refresh (Ctrl+Shift+R).

- Images not visible
  - Add JPGs to `frontend/public/mithai/` with the names listed above.
  - If not present, the app tries remote URLs; if blocked by network, it shows a generated SVG placeholder (so cards are never empty).

- PowerShell blocks npm
  - Use `npm.cmd` (e.g., `npm.cmd install`, `npm.cmd run dev`), or run once:
    `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force`

- Empty list on dashboard
  - Reseed the backend:
    ```
    cd sweet-shop/backend
    npm.cmd run db:reset
    npm.cmd run db:seed
    ```
  - Click “Reset” on the dashboard to reload all items.

---

## My AI Usage (required by assignment)

I used an AI assistant to:
- Bootstrap the React/Vite/TypeScript frontend and write initial components.
- Design the theme (gradients, glass cards) and build the responsive grid/CSS.
- Implement image fallback logic (local → remote → placeholder) and skeleton loaders.
- Write the README and quick‑start steps.
I reviewed and adapted all code, localized currency to INR, and tested the full flow with the provided backend.

Example commit trailer: