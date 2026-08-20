import type { Product } from '@/types';

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1', name: 'Korean Pearl Hoop Earrings', slug: 'korean-pearl-hoop-earrings', sku: 'AAK-EAR-001',
    description: 'Delicate Korean-inspired pearl hoop earrings featuring lustrous faux pearls set in rose gold plated hoops.',
    price: 899, discountedPrice: 649,
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80', 'https://images.unsplash.com/photo-1588444837495-c5d2b152aabb?w=800&q=80'],
    material: 'Rose Gold Plated Brass with Faux Pearl', weight: '4g (pair)',
    careInstructions: 'Store in anti-tarnish pouch. Avoid contact with perfumes and water.',
    stock: 45, rating: 4.8, reviewCount: 127, tags: ['korean', 'pearl', 'hoop'],
    isFeatured: true, isBestSeller: true, isNewArrival: true, isTrending: true,
    category: { id: '1', name: 'Korean Jewellery', slug: 'korean-jewellery' },
  },
  {
    id: '2', name: 'Anti-Tarnish Gold Stud Earrings', slug: 'anti-tarnish-gold-stud-earrings', sku: 'AAK-EAR-002',
    description: 'Premium anti-tarnish gold stud earrings with PVD coating that maintains their shine for years.',
    price: 749, discountedPrice: 549,
    images: ['https://images.unsplash.com/photo-1588444837495-c5d2b152aabb?w=800&q=80', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'],
    material: 'Anti-Tarnish PVD Gold Plated Stainless Steel', weight: '2g (pair)',
    careInstructions: 'Water resistant. Guaranteed anti-tarnish for 2 years.',
    stock: 78, rating: 4.9, reviewCount: 203, tags: ['anti-tarnish', 'stud', 'gold'],
    isFeatured: true, isBestSeller: true,
    category: { id: '2', name: 'Anti-Tarnish', slug: 'anti-tarnish' },
  },
  {
    id: '3', name: 'Crystal Drop Earrings', slug: 'crystal-drop-earrings', sku: 'AAK-EAR-003',
    description: 'Sparkling crystal drop earrings that catch every ray of light.',
    price: 1299, discountedPrice: 999,
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'],
    material: 'Rhodium Plated Brass with Austrian Crystal', weight: '6g (pair)',
    careInstructions: 'Handle with care. Store separately to avoid scratches.',
    stock: 32, rating: 4.7, reviewCount: 89, tags: ['crystal', 'drop', 'party'],
    isFeatured: true, isTrending: true,
    category: { id: '3', name: 'Earrings', slug: 'earrings' },
  },
  {
    id: '4', name: 'Rose Gold Heart Earrings', slug: 'rose-gold-heart-earrings', sku: 'AAK-EAR-004',
    description: 'Romantic rose gold heart-shaped earrings with a subtle shimmer finish.',
    price: 599, discountedPrice: 449,
    images: ['https://images.unsplash.com/photo-1588444837495-c5d2b152aabb?w=800&q=80'],
    material: 'Rose Gold Plated Sterling Silver', weight: '3g (pair)',
    careInstructions: 'Keep away from moisture. Store in provided pouch.',
    stock: 56, rating: 4.6, reviewCount: 64, tags: ['rose-gold', 'heart'],
    isNewArrival: true,
    category: { id: '3', name: 'Earrings', slug: 'earrings' },
  },
  {
    id: '5', name: 'Minimal Korean Earrings', slug: 'minimal-korean-earrings', sku: 'AAK-EAR-005',
    description: 'Ultra-minimal Korean-style threader earrings with a sleek geometric design.',
    price: 499, discountedPrice: 349,
    images: ['https://images.unsplash.com/photo-1615651818470-4c4b8d5e2f1a?w=800&q=80'],
    material: '18K Gold Plated Surgical Steel', weight: '1.5g (pair)',
    careInstructions: 'Minimal care required. Wipe after use.',
    stock: 92, rating: 4.8, reviewCount: 156, tags: ['korean', 'minimal'],
    isBestSeller: true, isTrending: true,
    category: { id: '1', name: 'Korean Jewellery', slug: 'korean-jewellery' },
  },
  {
    id: '6', name: 'Korean Layered Necklace', slug: 'korean-layered-necklace', sku: 'AAK-NEK-001',
    description: 'Trendy triple-layer Korean necklace set featuring delicate chains with tiny charms.',
    price: 1499, discountedPrice: 1099,
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'],
    material: 'Gold Plated Stainless Steel', weight: '12g',
    careInstructions: 'Layer gently when storing. Avoid tangling.',
    stock: 38, rating: 4.9, reviewCount: 178, tags: ['korean', 'layered'],
    isFeatured: true, isBestSeller: true, isNewArrival: true,
    category: { id: '1', name: 'Korean Jewellery', slug: 'korean-jewellery' },
  },
  {
    id: '7', name: 'Anti-Tarnish Pendant Necklace', slug: 'anti-tarnish-pendant-necklace', sku: 'AAK-NEK-002',
    description: 'Classic solitaire pendant necklace with anti-tarnish PVD coating.',
    price: 1199, discountedPrice: 899,
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'],
    material: 'Anti-Tarnish PVD Gold with Cubic Zirconia', weight: '8g',
    careInstructions: '2-year anti-tarnish guarantee. Water resistant.',
    stock: 61, rating: 4.8, reviewCount: 142, tags: ['anti-tarnish', 'pendant'],
    isFeatured: true, isBestSeller: true,
    category: { id: '2', name: 'Anti-Tarnish', slug: 'anti-tarnish' },
  },
  {
    id: '8', name: 'Butterfly Charm Necklace', slug: 'butterfly-charm-necklace', sku: 'AAK-NEK-003',
    description: 'Whimsical butterfly charm necklace with delicate wing details and micro crystal accents.',
    price: 899, discountedPrice: 699,
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'],
    material: 'Rose Gold Plated Brass with Crystal Accents', weight: '7g',
    careInstructions: 'Handle charm with care. Avoid pulling chain.',
    stock: 44, rating: 4.7, reviewCount: 93, tags: ['butterfly', 'charm'],
    isNewArrival: true, isTrending: true,
    category: { id: '4', name: 'Necklaces', slug: 'necklaces' },
  },
  {
    id: '9', name: 'Pearl Statement Necklace', slug: 'pearl-statement-necklace', sku: 'AAK-NEK-004',
    description: 'Bold multi-strand pearl statement necklace perfect for weddings and festive occasions.',
    price: 2499, discountedPrice: 1899,
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'],
    material: 'Gold Plated Brass with Premium Faux Pearls', weight: '35g',
    careInstructions: 'Store flat to prevent strand tangling.',
    stock: 18, rating: 4.9, reviewCount: 67, tags: ['pearl', 'statement'],
    isFeatured: true,
    category: { id: '4', name: 'Necklaces', slug: 'necklaces' },
  },
  {
    id: '10', name: 'Luxury Gold Chain Necklace', slug: 'luxury-gold-chain-necklace', sku: 'AAK-NEK-005',
    description: 'Premium paperclip chain necklace in champagne gold finish.',
    price: 1799, discountedPrice: 1399,
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'],
    material: '18K Champagne Gold Plated Sterling Silver', weight: '15g',
    careInstructions: 'Store clasp closed. Polish monthly with gold polishing cloth.',
    stock: 29, rating: 4.8, reviewCount: 112, tags: ['gold', 'chain', 'luxury'],
    isBestSeller: true, isTrending: true,
    category: { id: '4', name: 'Necklaces', slug: 'necklaces' },
  },
];

export function getSampleProducts(filter?: { featured?: boolean; bestSeller?: boolean; newArrival?: boolean; trending?: boolean; category?: string }): Product[] {
  let products = [...SAMPLE_PRODUCTS];
  if (filter?.featured) products = products.filter(p => p.isFeatured);
  if (filter?.bestSeller) products = products.filter(p => p.isBestSeller);
  if (filter?.newArrival) products = products.filter(p => p.isNewArrival);
  if (filter?.trending) products = products.filter(p => p.isTrending);
  if (filter?.category) products = products.filter(p => p.category?.slug === filter.category);
  return products;
}

export function getSampleProductBySlug(slug: string): Product | undefined {
  return SAMPLE_PRODUCTS.find(p => p.slug === slug);
}
