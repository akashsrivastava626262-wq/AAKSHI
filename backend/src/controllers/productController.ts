import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { getParam } from '../utils/jwt';

const productSelect = {
  id: true,
  name: true,
  slug: true,
  sku: true,
  description: true,
  shortDescription: true,
  price: true,
  discountedPrice: true,
  images: true,
  material: true,
  weight: true,
  careInstructions: true,
  stock: true,
  rating: true,
  reviewCount: true,
  tags: true,
  isFeatured: true,
  isBestSeller: true,
  isNewArrival: true,
  isTrending: true,
  category: { select: { id: true, name: true, slug: true } },
};

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = '1',
    limit = '12',
    category,
    search,
    sort = 'newest',
    minPrice,
    maxPrice,
    material,
    featured,
    bestSeller,
    newArrival,
    trending,
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const where: Record<string, unknown> = { isActive: true };

  if (category) where.category = { slug: category };
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
      { tags: { has: search as string } },
    ];
  }
  if (minPrice) where.price = { ...(where.price as object || {}), gte: parseFloat(minPrice as string) };
  if (maxPrice) where.price = { ...(where.price as object || {}), lte: parseFloat(maxPrice as string) };
  if (material) where.material = { contains: material as string, mode: 'insensitive' };
  if (featured === 'true') where.isFeatured = true;
  if (bestSeller === 'true') where.isBestSeller = true;
  if (newArrival === 'true') where.isNewArrival = true;
  if (trending === 'true') where.isTrending = true;

  const orderBy: Record<string, string> = {};
  switch (sort) {
    case 'price_asc': orderBy.price = 'asc'; break;
    case 'price_desc': orderBy.price = 'desc'; break;
    case 'rating': orderBy.rating = 'desc'; break;
    case 'popular': orderBy.viewCount = 'desc'; break;
    default: orderBy.createdAt = 'desc';
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, select: productSelect, orderBy, skip, take: limitNum }),
    prisma.product.count({ where }),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const slug = getParam(req.params.slug);

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      ...productSelect,
      reviews: {
        where: { status: 'APPROVED' },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, avatar: true } } },
      },
    },
  });

  if (!product) throw new AppError('Product not found', 404);

  await prisma.product.update({ where: { slug }, data: { viewCount: { increment: 1 } } });

  if (req.user) {
    await prisma.recentlyViewed.upsert({
      where: { userId_productId: { userId: req.user.id, productId: product.id } },
      update: { viewedAt: new Date() },
      create: { userId: req.user.id, productId: product.id },
    });
  }

  res.json({ success: true, data: product });
});

export const getFeatured = asyncHandler(async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    select: productSelect,
    take: 8,
  });
  res.json({ success: true, data: products });
});

export const getBestSellers = asyncHandler(async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: { isActive: true, isBestSeller: true },
    select: productSelect,
    take: 8,
  });
  res.json({ success: true, data: products });
});

export const getNewArrivals = asyncHandler(async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: { isActive: true, isNewArrival: true },
    select: productSelect,
    take: 8,
  });
  res.json({ success: true, data: products });
});

export const getTrending = asyncHandler(async (req: Request, res: Response) => {
  const { type } = req.query;
  const where: Record<string, unknown> = { isActive: true, isTrending: true };
  if (type === 'earrings') where.category = { slug: 'earrings' };
  if (type === 'necklaces') where.category = { slug: 'necklaces' };

  const products = await prisma.product.findMany({
    where,
    select: productSelect,
    take: 8,
  });
  res.json({ success: true, data: products });
});

export const getSearchSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q || (q as string).length < 2) {
    return res.json({ success: true, data: [] });
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q as string, mode: 'insensitive' } },
        { tags: { has: q as string } },
      ],
    },
    select: { id: true, name: true, slug: true, images: true, price: true, discountedPrice: true },
    take: 8,
  });

  res.json({ success: true, data: products });
});

export const getRecommendations = asyncHandler(async (req: Request, res: Response) => {
  const productId = getParam(req.params.productId);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { categoryId: true, tags: true },
  });

  if (!product) throw new AppError('Product not found', 404);

  const recommendations = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: productId },
      OR: [
        { categoryId: product.categoryId },
        { tags: { hasSome: product.tags } },
      ],
    },
    select: productSelect,
    take: 8,
    orderBy: { rating: 'desc' },
  });

  res.json({ success: true, data: recommendations });
});

export const getRecentlyViewed = asyncHandler(async (req: Request, res: Response) => {
  const viewed = await prisma.recentlyViewed.findMany({
    where: { userId: req.user!.id },
    orderBy: { viewedAt: 'desc' },
    take: 8,
    include: { product: { select: productSelect } },
  });

  res.json({ success: true, data: viewed.map(v => v.product) });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await prisma.product.create({ data: req.body, include: { category: true } });
  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await prisma.product.update({
    where: { id: getParam(req.params.id) },
    data: req.body,
    include: { category: true },
  });
  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await prisma.product.update({ where: { id: getParam(req.params.id) }, data: { isActive: false } });
  res.json({ success: true, message: 'Product deactivated' });
});

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  });
  res.json({ success: true, data: categories });
});
