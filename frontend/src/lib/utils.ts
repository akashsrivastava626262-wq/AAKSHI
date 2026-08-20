export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscount(price: number, discountedPrice?: number | null): number {
  if (!discountedPrice || discountedPrice >= price) return 0;
  return Math.round(((price - discountedPrice) / price) * 100);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  PROCESSING: { label: 'Processing', color: 'bg-indigo-100 text-indigo-800' },
  SHIPPED: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  REFUNDED: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
};

export const TRUST_BADGES = [
  { icon: 'Shield', title: '100% Secure Payments', description: 'SSL encrypted checkout' },
  { icon: 'Gift', title: 'Premium Packaging', description: 'Luxury unboxing experience' },
  { icon: 'RefreshCw', title: 'Easy Returns', description: '7-day hassle-free returns' },
  { icon: 'Truck', title: 'Fast Shipping', description: 'Free shipping above ₹999' },
  { icon: 'Award', title: 'Authentic Quality', description: 'Premium materials guaranteed' },
  { icon: 'Headphones', title: 'Customer Support', description: '24/7 dedicated support' },
  { icon: 'Sparkles', title: 'Anti-Tarnish Guarantee', description: '2-year shine promise' },
];

export const FAQ_ITEMS = [
  {
    question: 'What materials are used in AAKSHI jewellery?',
    answer: 'We use premium quality materials including rose gold plated brass, anti-tarnish PVD coated stainless steel, sterling silver, and high-grade faux pearls and crystals. All materials are hypoallergenic and skin-safe.',
  },
  {
    question: 'How does the anti-tarnish guarantee work?',
    answer: 'Our anti-tarnish collection comes with a 2-year guarantee against tarnishing. If your jewellery tarnishes within this period, we will replace it free of charge. Simply contact our support team with your order details.',
  },
  {
    question: 'What is your return and exchange policy?',
    answer: 'We offer a 7-day return policy for unused items in original packaging. Exchanges are available within 15 days. Custom or personalized items cannot be returned unless defective.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available at checkout. Free standard shipping on orders above ₹999.',
  },
  {
    question: 'Do you offer gift packaging?',
    answer: 'Yes! We offer premium gift packaging for ₹49 per item. Our luxury boxes come with a satin ribbon and a personalized note card — perfect for gifting.',
  },
  {
    question: 'How do I care for my jewellery?',
    answer: 'Store in the provided anti-tarnish pouch, avoid contact with perfumes and water, and wipe with a soft cloth after each use. Each product page includes specific care instructions.',
  },
];

export const INSTAGRAM_POSTS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80', likes: 1234 },
  { id: 2, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80', likes: 987 },
  { id: 3, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80', likes: 2156 },
  { id: 4, image: 'https://images.unsplash.com/photo-1588444837495-c5d2b152aabb?w=400&q=80', likes: 876 },
  { id: 5, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80', likes: 1543 },
  { id: 6, image: 'https://images.unsplash.com/photo-1615651818470-4c4b8d5e2f1a?w=400&q=80', likes: 765 },
];
