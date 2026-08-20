import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authApi = {
  register: (data: { email: string; password: string; name: string; phone?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  googleAuth: (data: { googleId: string; email: string; name: string; avatar?: string }) =>
    api.post('/auth/google', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: Partial<{ name: string; phone: string; avatar: string }>) =>
    api.put('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
};

// Products
export const productApi = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    api.get('/products', { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  getFeatured: () => api.get('/products/featured'),
  getBestSellers: () => api.get('/products/best-sellers'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  getTrending: (type?: string) => api.get('/products/trending', { params: { type } }),
  search: (q: string) => api.get('/products/search', { params: { q } }),
  getCategories: () => api.get('/products/categories'),
  getRecommendations: (productId: string) => api.get(`/products/${productId}/recommendations`),
  getRecentlyViewed: () => api.get('/products/user/recently-viewed'),
};

// Cart & Wishlist
export const cartApi = {
  get: () => api.get('/cart'),
  add: (data: { productId: string; quantity?: number; giftWrap?: boolean }) =>
    api.post('/cart', data),
  update: (id: string, data: { quantity?: number; giftWrap?: boolean }) =>
    api.put(`/cart/${id}`, data),
  remove: (id: string) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart'),
  getWishlist: () => api.get('/cart/wishlist'),
  addToWishlist: (productId: string) => api.post('/cart/wishlist', { productId }),
  removeFromWishlist: (productId: string) => api.delete(`/cart/wishlist/${productId}`),
};

// Orders
export const orderApi = {
  create: (data: {
    addressId: string;
    couponCode?: string;
    paymentMethod: string;
    giftWrap?: boolean;
    notes?: string;
  }) => api.post('/orders', data),
  verifyPayment: (data: {
    orderId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }) => api.post('/orders/verify-payment', data),
  validateCoupon: (code: string, subtotal: number) =>
    api.post('/orders/validate-coupon', { code, subtotal }),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  track: (orderNumber: string) => api.get(`/orders/track/${orderNumber}`),
  addReview: (data: { productId: string; rating: number; title?: string; comment: string }) =>
    api.post('/orders/reviews', data),
  addAddress: (data: Omit<import('@/types').Address, 'id' | 'isDefault'> & { isDefault?: boolean }) =>
    api.post('/orders/addresses', data),
  updateAddress: (id: string, data: Partial<import('@/types').Address>) =>
    api.put(`/orders/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/orders/addresses/${id}`),
  subscribeNewsletter: (email: string) => api.post('/orders/newsletter', { email }),
};

// Admin
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getOrders: (params?: Record<string, string>) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id: string, data: { status: string; trackingNumber?: string }) =>
    api.put(`/admin/orders/${id}`, data),
  getCustomers: (params?: Record<string, string>) => api.get('/admin/customers', { params }),
  getProducts: (params?: Record<string, string>) => api.get('/admin/products', { params }),
  createProduct: (data: Partial<import('@/types').Product>) => api.post('/products', data),
  updateProduct: (id: string, data: Partial<import('@/types').Product>) =>
    api.put(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data: Record<string, unknown>) => api.post('/admin/coupons', data),
  getBanners: () => api.get('/admin/banners'),
  createBanner: (data: Record<string, unknown>) => api.post('/admin/banners', data),
  getReviews: (params?: Record<string, string>) => api.get('/admin/reviews', { params }),
  moderateReview: (id: string, status: string) => api.put(`/admin/reviews/${id}`, { status }),
  getSalesReport: (params?: Record<string, string>) => api.get('/admin/sales-report', { params }),
};

// Public
export const publicApi = {
  getReviews: () => api.get('/reviews'),
  getBanners: () => api.get('/products/banners/active'),
};
