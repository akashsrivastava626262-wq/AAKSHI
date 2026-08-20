# AAKSHI E-Commerce Platform

Premium fashion jewellery e-commerce platform built with Next.js, Express.js, PostgreSQL, and modern security practices.

## Architecture

```
aakshi/
├── frontend/          # Next.js 16 + React 19 + Tailwind CSS + Redux
├── backend/           # Express.js + TypeScript + Prisma ORM
├── docs/              # API documentation & deployment guide
├── docker-compose.yml # Full stack Docker deployment
└── .github/workflows/ # CI/CD pipeline
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Redux Toolkit |
| Backend | Node.js, Express.js, TypeScript, Prisma ORM |
| Database | PostgreSQL 16 |
| Auth | JWT + Google OAuth + RBAC |
| Payments | Razorpay + Stripe |
| Security | Helmet, Rate Limiting, Bcrypt, CORS, CSP, Input Validation |
| DevOps | Docker, GitHub Actions CI/CD |

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ (or Docker)
- npm

### 1. Clone & Install

```bash
git clone <repo-url>
cd aakshi

# Backend
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run db:seed

# Frontend
cd ../frontend
cp .env.example .env.local
npm install
```

### 2. Start Development

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/health

### 3. Docker (Production)

```bash
docker-compose up -d
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@aakshi.com | Admin@123456 |
| Customer | customer@aakshi.com | Customer@123 |

## Features

### Customer
- User registration & login (JWT + Google OAuth)
- Product browsing with search, filter, sort
- Wishlist & shopping cart
- Checkout with Razorpay/Stripe/UPI/COD
- Order tracking & history
- Product reviews & ratings
- Coupon system
- Address management
- Loyalty points & referral program
- Newsletter subscription
- Gift packaging option

### Admin Panel
- Dashboard analytics
- Product & inventory management
- Order management with status updates
- Customer management
- Coupon management
- Banner management
- Review moderation
- Sales reports

### Security
- JWT authentication with refresh tokens
- Bcrypt password hashing (12 rounds)
- Rate limiting (100 req/15min, 10 auth/15min)
- Helmet security headers + CSP
- Input validation (express-validator)
- SQL injection protection (Prisma ORM)
- CORS configuration
- Audit logging
- Environment variable protection

### SEO
- Meta tags & Open Graph
- JSON-LD structured data
- XML sitemap & robots.txt
- SEO-friendly URLs
- Server-side rendering

## Sample Products

10 premium jewellery products with complete data:
- 5 Earrings (Korean Pearl Hoops, Anti-Tarnish Studs, Crystal Drops, Rose Gold Hearts, Minimal Korean)
- 5 Necklaces (Korean Layered, Anti-Tarnish Pendant, Butterfly Charm, Pearl Statement, Luxury Gold Chain)

## Coupon Codes

| Code | Discount | Min Order |
|------|----------|-----------|
| AAKSHI10 | 10% off | ₹499 |
| WELCOME20 | 20% off | ₹999 |
| FLAT100 | ₹100 off | ₹799 |

## Documentation

- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## License

Proprietary — AAKSHI © 2026
