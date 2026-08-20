import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aakshi.com';

  const staticPages = [
    '', '/shop', '/collections/earrings', '/collections/necklaces',
    '/collections/korean-jewellery', '/collections/anti-tarnish',
    '/login', '/register', '/track-order', '/about', '/contact',
  ];

  const products = [
    'korean-pearl-hoop-earrings', 'anti-tarnish-gold-stud-earrings',
    'crystal-drop-earrings', 'rose-gold-heart-earrings', 'minimal-korean-earrings',
    'korean-layered-necklace', 'anti-tarnish-pendant-necklace',
    'butterfly-charm-necklace', 'pearl-statement-necklace', 'luxury-gold-chain-necklace',
  ];

  return [
    ...staticPages.map(path => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    })),
    ...products.map(slug => ({
      url: `${baseUrl}/products/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
