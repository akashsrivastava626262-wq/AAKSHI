import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { getParam } from '../utils/jwt';

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user!.id },
    include: {
      product: {
        select: {
          id: true, name: true, slug: true, price: true, discountedPrice: true,
          images: true, stock: true, sku: true,
        },
      },
    },
  });

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discountedPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  res.json({ success: true, data: { items, subtotal, itemCount: items.reduce((s, i) => s + i.quantity, 0) } });
});

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity = 1, giftWrap = false } = req.body;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) throw new AppError('Product not found', 404);
  if (product.stock < quantity) throw new AppError('Insufficient stock', 400);

  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId: req.user!.id, productId } },
    update: { quantity: { increment: quantity }, giftWrap },
    create: { userId: req.user!.id, productId, quantity, giftWrap },
    include: { product: { select: { id: true, name: true, price: true, discountedPrice: true, images: true } } },
  });

  res.status(201).json({ success: true, data: item });
});

export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { quantity, giftWrap } = req.body;
  const item = await prisma.cartItem.findFirst({
    where: { id: getParam(req.params.id), userId: req.user!.id },
    include: { product: true },
  });

  if (!item) throw new AppError('Cart item not found', 404);
  if (quantity && item.product.stock < quantity) throw new AppError('Insufficient stock', 400);

  const updated = await prisma.cartItem.update({
    where: { id: item.id },
    data: { ...(quantity !== undefined && { quantity }), ...(giftWrap !== undefined && { giftWrap }) },
    include: { product: { select: { id: true, name: true, price: true, discountedPrice: true, images: true } } },
  });

  res.json({ success: true, data: updated });
});

export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  await prisma.cartItem.deleteMany({ where: { id: getParam(req.params.id), userId: req.user!.id } });
  res.json({ success: true, message: 'Item removed from cart' });
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user!.id } });
  res.json({ success: true, message: 'Cart cleared' });
});

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const items = await prisma.wishlistItem.findMany({
    where: { userId: req.user!.id },
    include: {
      product: {
        select: {
          id: true, name: true, slug: true, price: true, discountedPrice: true,
          images: true, rating: true, stock: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: items });
});

export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.body;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError('Product not found', 404);

  const item = await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: req.user!.id, productId } },
    update: {},
    create: { userId: req.user!.id, productId },
    include: { product: { select: { id: true, name: true, slug: true, price: true, images: true } } },
  });

  res.status(201).json({ success: true, data: item });
});

export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  await prisma.wishlistItem.deleteMany({
    where: { userId: req.user!.id, productId: getParam(req.params.productId) },
  });
  res.json({ success: true, message: 'Removed from wishlist' });
});
