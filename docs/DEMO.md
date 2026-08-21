# AAKSHI Live Demo Guide

Use this guide to run and explore the full website + admin panel locally.

## Option 1: One-command Docker (recommended if Docker is installed)

```bash
cd AAKSHI
docker-compose up -d --build
```

Then open:
- **Website:** http://localhost:3000
- **API health:** http://localhost:5000/health

---

## Option 2: Manual setup (development)

### Step 1 — Database (PostgreSQL)

```bash
# Using Docker
docker run -d --name aakshi-postgres \
  -e POSTGRES_USER=aakshi \
  -e POSTGRES_PASSWORD=aakshi123 \
  -e POSTGRES_DB=aakshi_db \
  -p 5432:5432 \
  postgres:16-alpine
```

### Step 2 — Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Backend runs at **http://localhost:5000**

### Step 3 — Frontend (new terminal)

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Website runs at **http://localhost:3000**

---

## Demo login accounts

| Role | Email | Password | Where to go after login |
|------|-------|----------|-------------------------|
| **Customer** | customer@aakshi.com | Customer@123 | Homepage, cart, orders |
| **Admin** | admin@aakshi.com | Admin@123456 | http://localhost:3000/admin |

---

## What to explore

### Customer website

| Page | URL | What you'll see |
|------|-----|-----------------|
| Landing page | http://localhost:3000 | Hero, collections, best sellers, reviews, FAQ |
| Shop | http://localhost:3000/shop | All 10 products + filters |
| Product detail | http://localhost:3000/products/korean-pearl-hoop-earrings | Images, price, add to cart |
| Collections | http://localhost:3000/collections/korean-jewellery | Category products |
| Cart | http://localhost:3000/cart | Requires customer login |
| Checkout | http://localhost:3000/checkout | Address, coupon, payment |
| Wishlist | http://localhost:3000/wishlist | Saved products |
| Track order | http://localhost:3000/track-order | Public order lookup |
| Login | http://localhost:3000/login | Sign in / register |

### Admin panel (admin login required)

| Page | URL | What you'll see |
|------|-----|-----------------|
| Dashboard | http://localhost:3000/admin | Revenue, orders, customers, top products |
| Orders | http://localhost:3000/admin/orders | Manage & update order status |
| Products | http://localhost:3000/admin/products | All 10 products, stock, SKUs |

---

## Sample customer flow (5 minutes)

1. Open http://localhost:3000 — browse the landing page
2. Go to **Shop** → open **Korean Pearl Hoop Earrings**
3. **Login** as `customer@aakshi.com` / `Customer@123`
4. **Add to cart** → open **Cart** → **Proceed to checkout**
5. Add address, apply coupon `AAKSHI10`, place order (demo mode if Razorpay keys not set)

## Sample admin flow (3 minutes)

1. **Login** as `admin@aakshi.com` / `Admin@123456`
2. Open http://localhost:3000/admin — view dashboard stats
3. Open **Orders** — update order status after a test purchase
4. Open **Products** — view inventory for all 10 items

---

## Coupon codes to test

- `AAKSHI10` — 10% off (min ₹499)
- `WELCOME20` — 20% off (min ₹999)
- `FLAT100` — ₹100 off (min ₹799)

---

## Troubleshooting

**Products not loading?** Ensure backend is running and `NEXT_PUBLIC_API_URL=http://localhost:5000/api` in `frontend/.env.local`.

**Login fails?** Run `npm run db:seed` in the backend folder to recreate demo users.

**Database connection error?** Check PostgreSQL is running and `DATABASE_URL` in `backend/.env` is correct.
