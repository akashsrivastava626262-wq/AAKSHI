# AAKSHI API Documentation

Base URL: `http://localhost:5000/api`

All responses follow the format:
```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "pagination": { "page": 1, "limit": 12, "total": 100, "pages": 9 }
}
```

Authentication: Include `Authorization: Bearer <access_token>` header for protected routes.

---

## Authentication

### POST /auth/register
Register a new customer account.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass1",
  "name": "Jane Doe",
  "phone": "+919876543210"
}
```

### POST /auth/login
Login with email and password.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass1"
}
```

**Response:** Returns `accessToken`, `refreshToken`, and `user` object.

### POST /auth/google
Google OAuth login/register.

**Body:**
```json
{
  "googleId": "google-user-id",
  "email": "user@gmail.com",
  "name": "Jane Doe",
  "avatar": "https://..."
}
```

### POST /auth/refresh
Refresh access token.

**Body:** `{ "refreshToken": "..." }`

### GET /auth/profile 🔒
Get current user profile with addresses.

### PUT /auth/profile 🔒
Update profile. Body: `{ "name", "phone", "avatar" }`

### PUT /auth/change-password 🔒
Body: `{ "currentPassword", "newPassword" }`

---

## Products

### GET /products
List products with filtering and pagination.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 12) |
| category | string | Category slug filter |
| search | string | Search term |
| sort | string | newest, price_asc, price_desc, rating, popular |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| featured | boolean | Featured products only |
| bestSeller | boolean | Best sellers only |
| newArrival | boolean | New arrivals only |
| trending | boolean | Trending products only |

### GET /products/featured
Get featured products (max 8).

### GET /products/best-sellers
Get best selling products.

### GET /products/new-arrivals
Get new arrival products.

### GET /products/trending?type=earrings|necklaces
Get trending products, optionally filtered by type.

### GET /products/search?q=pearl
Smart search suggestions (min 2 characters).

### GET /products/categories
List all active categories.

### GET /products/:slug
Get product details by slug. Tracks recently viewed for authenticated users.

### GET /products/:productId/recommendations
AI-powered product recommendations.

### GET /products/user/recently-viewed 🔒
Get user's recently viewed products.

---

## Cart & Wishlist

### GET /cart 🔒
Get cart items with subtotal.

### POST /cart 🔒
Add item to cart. Body: `{ "productId", "quantity", "giftWrap" }`

### PUT /cart/:id 🔒
Update cart item. Body: `{ "quantity", "giftWrap" }`

### DELETE /cart/:id 🔒
Remove item from cart.

### DELETE /cart 🔒
Clear entire cart.

### GET /cart/wishlist 🔒
Get wishlist items.

### POST /cart/wishlist 🔒
Add to wishlist. Body: `{ "productId" }`

### DELETE /cart/wishlist/:productId 🔒
Remove from wishlist.

---

## Orders

### POST /orders 🔒
Create order from cart.

**Body:**
```json
{
  "addressId": "uuid",
  "couponCode": "AAKSHI10",
  "paymentMethod": "RAZORPAY",
  "giftWrap": false,
  "notes": "Optional delivery notes"
}
```

**Payment Methods:** RAZORPAY, STRIPE, UPI, CARD, NET_BANKING, WALLET, COD

### POST /orders/verify-payment 🔒
Verify Razorpay payment.

**Body:**
```json
{
  "orderId": "uuid",
  "razorpayPaymentId": "...",
  "razorpayOrderId": "...",
  "razorpaySignature": "..."
}
```

### POST /orders/validate-coupon 🔒
Validate coupon code. Body: `{ "code", "subtotal" }`

### GET /orders 🔒
Get user's order history.

### GET /orders/:id 🔒
Get order details.

### GET /orders/track/:orderNumber
Public order tracking (no auth required).

### POST /orders/reviews 🔒
Add product review. Body: `{ "productId", "rating", "title", "comment" }`

### POST /orders/addresses 🔒
Add delivery address.

### PUT /orders/addresses/:id 🔒
Update address.

### DELETE /orders/addresses/:id 🔒
Delete address.

### POST /orders/newsletter
Subscribe to newsletter. Body: `{ "email" }`

---

## Admin (Requires ADMIN or SUPER_ADMIN role)

### GET /admin/dashboard
Dashboard analytics: revenue, orders, customers, top products.

### GET /admin/orders?status=PENDING&page=1
List all orders with filtering.

### PUT /admin/orders/:id
Update order status. Body: `{ "status", "trackingNumber" }`

### GET /admin/customers?search=name&page=1
List customers.

### GET /admin/products?search=name&page=1
List all products (including inactive).

### POST /products (via admin)
Create product.

### PUT /products/:id (via admin)
Update product.

### DELETE /products/:id (via admin)
Deactivate product.

### GET /admin/coupons
List coupons.

### POST /admin/coupons
Create coupon.

### PUT /admin/coupons/:id
Update coupon.

### GET /admin/banners
List banners.

### POST /admin/banners
Create banner.

### PUT /admin/banners/:id
Update banner.

### DELETE /admin/banners/:id
Delete banner.

### GET /admin/reviews?status=PENDING
List reviews for moderation.

### PUT /admin/reviews/:id
Moderate review. Body: `{ "status": "APPROVED" | "REJECTED" }`

### GET /admin/sales-report?startDate=2026-01-01&endDate=2026-12-31
Sales report with revenue analytics.

---

## Public

### GET /reviews
Get approved public reviews.

### GET /products/banners/active
Get active homepage banners.

### GET /health
Health check endpoint.

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Validation error / Bad request |
| 401 | Authentication required / Invalid token |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict (e.g., email already registered) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
