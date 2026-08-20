# AAKSHI Deployment Guide

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Production Deployment](#production-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Payment Gateway Setup](#payment-gateway-setup)
7. [SSL/HTTPS Configuration](#sslhttps-configuration)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Local Development

```bash
# 1. Start PostgreSQL (via Docker)
docker run -d --name aakshi-postgres \
  -e POSTGRES_USER=aakshi \
  -e POSTGRES_PASSWORD=aakshi123 \
  -e POSTGRES_DB=aakshi_db \
  -p 5432:5432 \
  postgres:16-alpine

# 2. Setup Backend
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev

# 3. Setup Frontend (new terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

---

## Docker Deployment

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Reset database
docker-compose down -v
docker-compose up -d
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

---

## Production Deployment

### Recommended Stack
- **Frontend**: Vercel or AWS Amplify
- **Backend**: AWS EC2, Railway, or Render
- **Database**: AWS RDS PostgreSQL or Supabase
- **CDN**: CloudFront or Cloudflare
- **Images**: Cloudinary or AWS S3

### Backend (Railway/Render)

1. Connect GitHub repository
2. Set root directory to `backend`
3. Set build command: `npm install && npx prisma generate && npm run build`
4. Set start command: `npx prisma db push && node dist/index.js`
5. Add environment variables (see below)
6. Add PostgreSQL addon

### Frontend (Vercel)

1. Connect GitHub repository
2. Set root directory to `frontend`
3. Framework preset: Next.js
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL=https://api.aakshi.com/api`
   - `NEXT_PUBLIC_SITE_URL=https://aakshi.com`
5. Deploy

### AWS EC2 (Full Stack)

```bash
# On EC2 instance
sudo apt update && sudo apt install -y docker.io docker-compose
git clone <repo-url> /opt/aakshi
cd /opt/aakshi

# Configure environment
cp backend/.env.example backend/.env
# Edit .env with production values

# Start services
docker-compose up -d --build

# Setup Nginx reverse proxy
sudo apt install nginx
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name aakshi.com www.aakshi.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name aakshi.com www.aakshi.com;

    ssl_certificate /etc/letsencrypt/live/aakshi.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aakshi.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Environment Variables

### Backend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| PORT | No | Server port (default: 5000) |
| NODE_ENV | Yes | production/development |
| DATABASE_URL | Yes | PostgreSQL connection string |
| JWT_SECRET | Yes | Min 32 characters |
| JWT_REFRESH_SECRET | Yes | Min 32 characters |
| FRONTEND_URL | Yes | Frontend URL for CORS |
| RAZORPAY_KEY_ID | For payments | Razorpay key |
| RAZORPAY_KEY_SECRET | For payments | Razorpay secret |
| STRIPE_SECRET_KEY | For payments | Stripe secret key |
| GOOGLE_CLIENT_ID | For OAuth | Google OAuth client ID |
| SMTP_HOST | For emails | SMTP server |
| SMTP_USER | For emails | SMTP username |
| SMTP_PASS | For emails | SMTP password |

### Frontend (.env.local)

| Variable | Required | Description |
|----------|----------|-------------|
| NEXT_PUBLIC_API_URL | Yes | Backend API URL |
| NEXT_PUBLIC_SITE_URL | Yes | Site URL for SEO |
| NEXTAUTH_SECRET | For OAuth | NextAuth secret |
| GOOGLE_CLIENT_ID | For OAuth | Google client ID |

---

## Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed sample data
npm run db:seed

# Open Prisma Studio (GUI)
npm run db:studio

# Create migration (production)
npx prisma migrate dev --name init
```

---

## Payment Gateway Setup

### Razorpay
1. Create account at https://razorpay.com
2. Get API keys from Dashboard → Settings → API Keys
3. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
4. Add webhook URL: `https://api.aakshi.com/api/orders/webhook/razorpay`

### Stripe
1. Create account at https://stripe.com
2. Get secret key from Dashboard → Developers → API Keys
3. Set `STRIPE_SECRET_KEY`
4. Configure webhook for checkout.session.completed

---

## SSL/HTTPS Configuration

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d aakshi.com -d www.aakshi.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Monitoring & Maintenance

### Health Checks
- Backend: `GET /health`
- Database: Prisma connection check on startup

### Logs
- Backend uses Winston logger
- Set `LOG_LEVEL=debug` for verbose logging
- Docker: `docker-compose logs -f backend`

### Backups
```bash
# Database backup
pg_dump -U aakshi aakshi_db > backup_$(date +%Y%m%d).sql

# Restore
psql -U aakshi aakshi_db < backup_20260201.sql
```

### Performance
- Enable Redis caching for product listings (future enhancement)
- Use Cloudinary for image CDN
- Enable gzip compression (already configured via compression middleware)
- Database indexes are configured in Prisma schema

### Security Checklist
- [ ] Change all default secrets in production
- [ ] Enable HTTPS everywhere
- [ ] Configure firewall (allow only 80, 443, 22)
- [ ] Set up rate limiting (configured by default)
- [ ] Regular dependency updates
- [ ] Database backups scheduled
- [ ] Monitor audit logs
