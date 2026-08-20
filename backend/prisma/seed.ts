import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const productImages = {
  earrings: [
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    'https://images.unsplash.com/photo-1588444837495-c5d2b152aabb?w=800&q=80',
  ],
  necklaces: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
  ],
};

async function main() {
  console.log('🌸 Seeding AAKSHI database...');

  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aakshi.com' },
    update: {},
    create: {
      email: 'admin@aakshi.com',
      password: adminPassword,
      name: 'AAKSHI Admin',
      role: 'SUPER_ADMIN',
      emailVerified: true,
    },
  });

  const customerPassword = await bcrypt.hash('Customer@123', 12);
  await prisma.user.upsert({
    where: { email: 'customer@aakshi.com' },
    update: {},
    create: {
      email: 'customer@aakshi.com',
      password: customerPassword,
      name: 'Priya Sharma',
      phone: '+919876543210',
      role: 'CUSTOMER',
      emailVerified: true,
      loyaltyPoints: 150,
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'earrings' },
      update: {},
      create: { name: 'Earrings', slug: 'earrings', description: 'Stunning earrings for every occasion', sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: 'necklaces' },
      update: {},
      create: { name: 'Necklaces', slug: 'necklaces', description: 'Elegant necklaces and pendants', sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: 'korean-jewellery' },
      update: {},
      create: { name: 'Korean Jewellery', slug: 'korean-jewellery', description: 'Trendy Korean-inspired jewellery', sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: 'anti-tarnish' },
      update: {},
      create: { name: 'Anti-Tarnish', slug: 'anti-tarnish', description: 'Long-lasting anti-tarnish jewellery', sortOrder: 4 },
    }),
  ]);

  const [earrings, necklaces, korean, antiTarnish] = categories;

  const products = [
    {
      name: 'Korean Pearl Hoop Earrings',
      slug: 'korean-pearl-hoop-earrings',
      sku: 'AAK-EAR-001',
      description: 'Delicate Korean-inspired pearl hoop earrings featuring lustrous faux pearls set in rose gold plated hoops. Perfect for everyday elegance and special occasions alike.',
      shortDescription: 'Elegant Korean pearl hoops in rose gold',
      price: 899,
      discountedPrice: 649,
      images: [productImages.earrings[0], 'https://images.unsplash.com/photo-1615651818470-4c4b8d5e2f1a?w=800&q=80'],
      categoryId: korean.id,
      material: 'Rose Gold Plated Brass with Faux Pearl',
      weight: '4g (pair)',
      careInstructions: 'Store in anti-tarnish pouch. Avoid contact with perfumes and water. Wipe with soft cloth after use.',
      stock: 45,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      isTrending: true,
      tags: ['korean', 'pearl', 'hoop', 'rose-gold'],
      rating: 4.8,
      reviewCount: 127,
    },
    {
      name: 'Anti-Tarnish Gold Stud Earrings',
      slug: 'anti-tarnish-gold-stud-earrings',
      sku: 'AAK-EAR-002',
      description: 'Premium anti-tarnish gold stud earrings with PVD coating that maintains their shine for years. Hypoallergenic and perfect for sensitive ears.',
      shortDescription: 'Long-lasting anti-tarnish gold studs',
      price: 749,
      discountedPrice: 549,
      images: [productImages.earrings[1], 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'],
      categoryId: antiTarnish.id,
      material: 'Anti-Tarnish PVD Gold Plated Stainless Steel',
      weight: '2g (pair)',
      careInstructions: 'Water resistant. No special care needed. Guaranteed anti-tarnish for 2 years.',
      stock: 78,
      isFeatured: true,
      isBestSeller: true,
      tags: ['anti-tarnish', 'stud', 'gold', 'hypoallergenic'],
      rating: 4.9,
      reviewCount: 203,
    },
    {
      name: 'Crystal Drop Earrings',
      slug: 'crystal-drop-earrings',
      sku: 'AAK-EAR-003',
      description: 'Sparkling crystal drop earrings that catch every ray of light. Features premium Austrian crystals in an elegant teardrop design.',
      shortDescription: 'Sparkling crystal teardrop earrings',
      price: 1299,
      discountedPrice: 999,
      images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80', productImages.earrings[0]],
      categoryId: earrings.id,
      material: 'Rhodium Plated Brass with Austrian Crystal',
      weight: '6g (pair)',
      careInstructions: 'Handle with care. Store separately to avoid scratches. Clean with soft dry cloth.',
      stock: 32,
      isFeatured: true,
      isTrending: true,
      tags: ['crystal', 'drop', 'party', 'elegant'],
      rating: 4.7,
      reviewCount: 89,
    },
    {
      name: 'Rose Gold Heart Earrings',
      slug: 'rose-gold-heart-earrings',
      sku: 'AAK-EAR-004',
      description: 'Romantic rose gold heart-shaped earrings with a subtle shimmer finish. A perfect gift for someone special or a self-love treat.',
      shortDescription: 'Romantic rose gold heart studs',
      price: 599,
      discountedPrice: 449,
      images: [productImages.earrings[1], 'https://images.unsplash.com/photo-1588444837495-c5d2b152aabb?w=800&q=80'],
      categoryId: earrings.id,
      material: 'Rose Gold Plated Sterling Silver',
      weight: '3g (pair)',
      careInstructions: 'Keep away from moisture. Store in provided pouch. Polish gently with microfiber cloth.',
      stock: 56,
      isNewArrival: true,
      tags: ['rose-gold', 'heart', 'romantic', 'gift'],
      rating: 4.6,
      reviewCount: 64,
    },
    {
      name: 'Minimal Korean Earrings',
      slug: 'minimal-korean-earrings',
      sku: 'AAK-EAR-005',
      description: 'Ultra-minimal Korean-style threader earrings with a sleek geometric design. Lightweight and comfortable for all-day wear.',
      shortDescription: 'Sleek minimal Korean threader earrings',
      price: 499,
      discountedPrice: 349,
      images: ['https://images.unsplash.com/photo-1615651818470-4c4b8d5e2f1a?w=800&q=80', productImages.earrings[0]],
      categoryId: korean.id,
      material: '18K Gold Plated Surgical Steel',
      weight: '1.5g (pair)',
      careInstructions: 'Minimal care required. Wipe after use. Store flat to maintain shape.',
      stock: 92,
      isBestSeller: true,
      isTrending: true,
      tags: ['korean', 'minimal', 'threader', 'everyday'],
      rating: 4.8,
      reviewCount: 156,
    },
    {
      name: 'Korean Layered Necklace',
      slug: 'korean-layered-necklace',
      sku: 'AAK-NEK-001',
      description: 'Trendy triple-layer Korean necklace set featuring delicate chains with tiny charms. Creates an effortlessly chic layered look in one piece.',
      shortDescription: 'Triple-layer Korean charm necklace',
      price: 1499,
      discountedPrice: 1099,
      images: [productImages.necklaces[0], 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'],
      categoryId: korean.id,
      material: 'Gold Plated Stainless Steel',
      weight: '12g',
      careInstructions: 'Layer gently when storing. Avoid tangling. Keep dry and store in individual pouch.',
      stock: 38,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      tags: ['korean', 'layered', 'trendy', 'necklace'],
      rating: 4.9,
      reviewCount: 178,
    },
    {
      name: 'Anti-Tarnish Pendant Necklace',
      slug: 'anti-tarnish-pendant-necklace',
      sku: 'AAK-NEK-002',
      description: 'Classic solitaire pendant necklace with anti-tarnish PVD coating. Features a brilliant cubic zirconia stone that rivals real diamonds.',
      shortDescription: 'Anti-tarnish solitaire pendant necklace',
      price: 1199,
      discountedPrice: 899,
      images: [productImages.necklaces[1], productImages.necklaces[0]],
      categoryId: antiTarnish.id,
      material: 'Anti-Tarnish PVD Gold with Cubic Zirconia',
      weight: '8g',
      careInstructions: '2-year anti-tarnish guarantee. Water resistant. Professional cleaning recommended annually.',
      stock: 61,
      isFeatured: true,
      isBestSeller: true,
      tags: ['anti-tarnish', 'pendant', 'solitaire', 'cz'],
      rating: 4.8,
      reviewCount: 142,
    },
    {
      name: 'Butterfly Charm Necklace',
      slug: 'butterfly-charm-necklace',
      sku: 'AAK-NEK-003',
      description: 'Whimsical butterfly charm necklace with delicate wing details and micro crystal accents. Symbolizes transformation and beauty.',
      shortDescription: 'Delicate butterfly charm with crystals',
      price: 899,
      discountedPrice: 699,
      images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80', productImages.necklaces[1]],
      categoryId: necklaces.id,
      material: 'Rose Gold Plated Brass with Crystal Accents',
      weight: '7g',
      careInstructions: 'Handle charm with care. Avoid pulling chain. Store flat in jewellery box.',
      stock: 44,
      isNewArrival: true,
      isTrending: true,
      tags: ['butterfly', 'charm', 'whimsical', 'crystal'],
      rating: 4.7,
      reviewCount: 93,
    },
    {
      name: 'Pearl Statement Necklace',
      slug: 'pearl-statement-necklace',
      sku: 'AAK-NEK-004',
      description: 'Bold multi-strand pearl statement necklace perfect for weddings and festive occasions. Features graduated faux pearls in ivory white.',
      shortDescription: 'Multi-strand pearl statement piece',
      price: 2499,
      discountedPrice: 1899,
      images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80', productImages.necklaces[0]],
      categoryId: necklaces.id,
      material: 'Gold Plated Brass with Premium Faux Pearls',
      weight: '35g',
      careInstructions: 'Store flat to prevent strand tangling. Keep pearls away from cosmetics. Professional restringing available.',
      stock: 18,
      isFeatured: true,
      tags: ['pearl', 'statement', 'wedding', 'festive'],
      rating: 4.9,
      reviewCount: 67,
    },
    {
      name: 'Luxury Gold Chain Necklace',
      slug: 'luxury-gold-chain-necklace',
      sku: 'AAK-NEK-005',
      description: 'Premium paperclip chain necklace in champagne gold finish. A versatile piece that layers beautifully or stands alone as a statement.',
      shortDescription: 'Premium champagne gold paperclip chain',
      price: 1799,
      discountedPrice: 1399,
      images: [productImages.necklaces[1], 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'],
      categoryId: necklaces.id,
      material: '18K Champagne Gold Plated Sterling Silver',
      weight: '15g',
      careInstructions: 'Store clasp closed. Avoid sleeping with necklace on. Polish monthly with gold polishing cloth.',
      stock: 29,
      isBestSeller: true,
      isTrending: true,
      tags: ['gold', 'chain', 'luxury', 'layering'],
      rating: 4.8,
      reviewCount: 112,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  await prisma.coupon.upsert({
    where: { code: 'AAKSHI10' },
    update: {},
    create: {
      code: 'AAKSHI10',
      type: 'PERCENTAGE',
      value: 10,
      minOrderAmount: 499,
      maxDiscount: 500,
      usageLimit: 1000,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'WELCOME20' },
    update: {},
    create: {
      code: 'WELCOME20',
      type: 'PERCENTAGE',
      value: 20,
      minOrderAmount: 999,
      maxDiscount: 1000,
      usageLimit: 500,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'FLAT100' },
    update: {},
    create: {
      code: 'FLAT100',
      type: 'FIXED',
      value: 100,
      minOrderAmount: 799,
    },
  });

  await prisma.banner.upsert({
    where: { id: 'hero-banner-1' },
    update: {},
    create: {
      id: 'hero-banner-1',
      title: 'Timeless Elegance, Modern Style',
      subtitle: 'Discover our new Korean Collection — Where tradition meets contemporary fashion',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80',
      link: '/collections/korean-jewellery',
      buttonText: 'Shop Collection',
      sortOrder: 1,
    },
  });

  await prisma.banner.upsert({
    where: { id: 'hero-banner-2' },
    update: {},
    create: {
      id: 'hero-banner-2',
      title: 'Anti-Tarnish Guarantee',
      subtitle: 'Jewellery that stays beautiful — 2 year anti-tarnish promise on every piece',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1920&q=80',
      link: '/collections/anti-tarnish',
      buttonText: 'Explore Now',
      sortOrder: 2,
    },
  });

  const sampleReviews = [
    { productSlug: 'korean-pearl-hoop-earrings', rating: 5, title: 'Absolutely stunning!', comment: 'These earrings are even more beautiful in person. The pearl quality is amazing and they are so lightweight!' },
    { productSlug: 'anti-tarnish-gold-stud-earrings', rating: 5, title: 'Best purchase ever', comment: 'Been wearing these daily for 3 months and they still look brand new. True anti-tarnish quality!' },
    { productSlug: 'korean-layered-necklace', rating: 5, title: 'Got so many compliments', comment: 'Wore this to a party and everyone asked where I got it from. The layering effect is gorgeous.' },
    { productSlug: 'luxury-gold-chain-necklace', rating: 4, title: 'Premium quality', comment: 'The chain feels substantial and the gold color is perfect. Great for layering with other pieces.' },
  ];

  const customer = await prisma.user.findUnique({ where: { email: 'customer@aakshi.com' } });
  if (customer) {
    for (const review of sampleReviews) {
      const product = await prisma.product.findUnique({ where: { slug: review.productSlug } });
      if (product) {
        await prisma.review.upsert({
          where: { productId_userId: { productId: product.id, userId: customer.id } },
          update: {},
          create: {
            productId: product.id,
            userId: customer.id,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            status: 'APPROVED',
          },
        });
      }
    }
  }

  console.log('✅ Seeding completed!');
  console.log(`   Admin: admin@aakshi.com / Admin@123456`);
  console.log(`   Customer: customer@aakshi.com / Customer@123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
