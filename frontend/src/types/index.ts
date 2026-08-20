export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountedPrice?: number | null;
  images: string[];
  material: string;
  weight: string;
  careInstructions: string;
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  isActive?: boolean;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: { products: number };
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  loyaltyPoints: number;
  referralCode?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  giftWrap: boolean;
  product: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  trackingNumber?: string;
  giftWrap: boolean;
  createdAt: string;
  items: OrderItem[];
  address?: Address;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  giftWrap: boolean;
  product: Product;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
  user: { name: string; avatar?: string };
  product?: { name: string; slug: string; images: string[] };
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  buttonText?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
}

export interface WishlistState {
  items: { id: string; product: Product }[];
  isLoading: boolean;
}
