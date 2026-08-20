import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { asyncHandler } from '../middleware/errorHandler';
import { getParam } from '../utils/jwt';

export const getDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalOrders, totalRevenue, totalCustomers, totalProducts,
    recentOrders, topProducts, ordersByStatus, monthlyRevenue,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { total: true } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } }, items: true },
    }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
    prisma.order.groupBy({ by: ['status'], _count: true }),
    prisma.order.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: thirtyDaysAgo }, paymentStatus: 'PAID' },
      _sum: { total: true },
    }),
  ]);

  const topProductDetails = await Promise.all(
    topProducts.map(async (tp) => {
      const product = await prisma.product.findUnique({
        where: { id: tp.productId },
        select: { name: true, images: true, price: true },
      });
      return { ...product, totalSold: tp._sum.quantity };
    })
  );

  res.json({
    success: true,
    data: {
      stats: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        totalCustomers,
        totalProducts,
      },
      recentOrders,
      topProducts: topProductDetails,
      ordersByStatus,
    },
  });
});

export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const { status, page = '1', limit = '20' } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true, images: true } } } },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    }),
    prisma.order.count({ where }),
  ]);

  res.json({ success: true, data: orders, pagination: { page: pageNum, limit: limitNum, total } });
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status, trackingNumber } = req.body;
  const order = await prisma.order.update({
    where: { id: getParam(req.params.id) },
    data: { status, trackingNumber },
    include: { user: { select: { email: true, name: true } } },
  });
  res.json({ success: true, data: order });
});

export const getAllCustomers = asyncHandler(async (req: Request, res: Response) => {
  const { page = '1', limit = '20', search } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  const where: Record<string, unknown> = { role: 'CUSTOMER' };
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, phone: true, loyaltyPoints: true,
        isActive: true, createdAt: true, lastLoginAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    }),
    prisma.user.count({ where }),
  ]);

  res.json({ success: true, data: customers, pagination: { page: pageNum, limit: limitNum, total } });
});

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page = '1', limit = '20', search } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  const where: Record<string, unknown> = {};
  if (search) where.name = { contains: search as string, mode: 'insensitive' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({ success: true, data: products, pagination: { page: pageNum, limit: limitNum, total } });
});

export const getCoupons = asyncHandler(async (_req: Request, res: Response) => {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: coupons });
});

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await prisma.coupon.create({ data: req.body });
  res.status(201).json({ success: true, data: coupon });
});

export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await prisma.coupon.update({ where: { id: getParam(req.params.id) }, data: req.body });
  res.json({ success: true, data: coupon });
});

export const getBanners = asyncHandler(async (_req: Request, res: Response) => {
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json({ success: true, data: banners });
});

export const createBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await prisma.banner.create({ data: req.body });
  res.status(201).json({ success: true, data: banner });
});

export const updateBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await prisma.banner.update({ where: { id: getParam(req.params.id) }, data: req.body });
  res.json({ success: true, data: banner });
});

export const deleteBanner = asyncHandler(async (req: Request, res: Response) => {
  await prisma.banner.delete({ where: { id: getParam(req.params.id) } });
  res.json({ success: true, message: 'Banner deleted' });
});

export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;
  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const reviews = await prisma.review.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: reviews });
});

export const moderateReview = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const review = await prisma.review.update({
    where: { id: getParam(req.params.id) },
    data: { status },
    include: { product: true },
  });

  if (status === 'APPROVED') {
    const stats = await prisma.review.aggregate({
      where: { productId: review.productId, status: 'APPROVED' },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.product.update({
      where: { id: review.productId },
      data: { rating: stats._avg.rating || 0, reviewCount: stats._count },
    });
  }

  res.json({ success: true, data: review });
});

export const getSalesReport = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const where: Record<string, unknown> = { paymentStatus: 'PAID' };

  if (startDate) where.createdAt = { ...(where.createdAt as object || {}), gte: new Date(startDate as string) };
  if (endDate) where.createdAt = { ...(where.createdAt as object || {}), lte: new Date(endDate as string) };

  const [orders, revenue, avgOrderValue] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.aggregate({ where, _sum: { total: true, discount: true, shipping: true } }),
    prisma.order.aggregate({ where, _avg: { total: true } }),
  ]);

  res.json({
    success: true,
    data: {
      totalOrders: orders,
      totalRevenue: revenue._sum.total || 0,
      totalDiscount: revenue._sum.discount || 0,
      totalShipping: revenue._sum.shipping || 0,
      averageOrderValue: avgOrderValue._avg.total || 0,
    },
  });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await prisma.category.create({ data: req.body });
  res.status(201).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await prisma.category.update({ where: { id: getParam(req.params.id) }, data: req.body });
  res.json({ success: true, data: category });
});

export const getPublicBanners = asyncHandler(async (_req: Request, res: Response) => {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
  res.json({ success: true, data: banners });
});

export const getPublicReviews = asyncHandler(async (_req: Request, res: Response) => {
  const reviews = await prisma.review.findMany({
    where: { status: 'APPROVED' },
    take: 12,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, avatar: true } },
      product: { select: { name: true, slug: true, images: true } },
    },
  });
  res.json({ success: true, data: reviews });
});
