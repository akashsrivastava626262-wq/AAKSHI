import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { getParam } from '../utils/jwt';
import Razorpay from 'razorpay';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

const razorpay = process.env.RAZORPAY_KEY_ID
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET! })
  : null;

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const generateOrderNumber = () => `AAK${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { addressId, couponCode, paymentMethod, giftWrap = false, notes } = req.body;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: req.user!.id },
    include: { product: true },
  });

  if (cartItems.length === 0) throw new AppError('Cart is empty', 400);

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: req.user!.id },
  });
  if (!address) throw new AppError('Address not found', 404);

  let subtotal = 0;
  for (const item of cartItems) {
    if (item.product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${item.product.name}`, 400);
    }
    subtotal += (item.product.discountedPrice || item.product.price) * item.quantity;
  }

  let discount = 0;
  let coupon = null;
  if (couponCode) {
    coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
    if (!coupon || !coupon.isActive) throw new AppError('Invalid coupon', 400);
    if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new AppError('Coupon expired', 400);
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new AppError('Coupon usage limit reached', 400);
    if (subtotal < coupon.minOrderAmount) throw new AppError(`Minimum order amount is ₹${coupon.minOrderAmount}`, 400);

    if (coupon.type === 'PERCENTAGE') {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.value;
    }
  }

  const shipping = subtotal >= 999 ? 0 : 99;
  const giftWrapFee = giftWrap ? 49 * cartItems.filter(i => i.giftWrap || giftWrap).length : 0;
  const total = subtotal - discount + shipping + giftWrapFee;

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: req.user!.id,
        addressId,
        couponId: coupon?.id,
        subtotal,
        discount,
        shipping,
        giftWrapFee,
        total,
        paymentMethod,
        giftWrap,
        notes,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.discountedPrice || item.product.price,
            giftWrap: item.giftWrap || giftWrap,
          })),
        },
      },
      include: { items: { include: { product: true } }, address: true },
    });

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    if (coupon) {
      await tx.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
    }

    await tx.cartItem.deleteMany({ where: { userId: req.user!.id } });

    return newOrder;
  });

  let paymentData = null;

  if (paymentMethod === 'RAZORPAY' && razorpay) {
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: 'INR',
      receipt: order.orderNumber,
    });
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });
    paymentData = { razorpayOrderId: razorpayOrder.id, amount: total, currency: 'INR', key: process.env.RAZORPAY_KEY_ID };
  } else if (paymentMethod === 'STRIPE' && stripe) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: { name: `AAKSHI Order ${order.orderNumber}` },
          unit_amount: Math.round(total * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/orders/${order.id}?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout?cancelled=true`,
      metadata: { orderId: order.id },
    });
    await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });
    paymentData = { stripeSessionUrl: session.url };
  }

  res.status(201).json({ success: true, data: { order, payment: paymentData } });
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: req.user!.id },
  });
  if (!order) throw new AppError('Order not found', 404);

  const crypto = await import('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'FAILED' } });
    throw new AppError('Payment verification failed', 400);
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: 'PAID', status: 'CONFIRMED', paymentId: razorpayPaymentId },
  });

  await prisma.user.update({
    where: { id: req.user!.id },
    data: { loyaltyPoints: { increment: Math.floor(order.total / 100) } },
  });

  res.json({ success: true, data: updated });
});

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    include: {
      items: { include: { product: { select: { id: true, name: true, slug: true, images: true } } } },
      address: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: orders });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst({
    where: { id: getParam(req.params.id), userId: req.user!.id },
    include: {
      items: { include: { product: true } },
      address: true,
      coupon: true,
    },
  });
  if (!order) throw new AppError('Order not found', 404);
  res.json({ success: true, data: order });
});

export const trackOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderNumber = getParam(req.params.orderNumber);
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      orderNumber: true, status: true, paymentStatus: true, trackingNumber: true,
      createdAt: true, updatedAt: true,
      items: { include: { product: { select: { name: true, images: true } } } },
    },
  });
  if (!order) throw new AppError('Order not found', 404);
  res.json({ success: true, data: order });
});

export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.isActive) throw new AppError('Invalid coupon code', 400);
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new AppError('Coupon has expired', 400);
  if (subtotal < coupon.minOrderAmount) throw new AppError(`Minimum order amount is ₹${coupon.minOrderAmount}`, 400);

  let discount = coupon.type === 'PERCENTAGE'
    ? (subtotal * coupon.value) / 100
    : coupon.value;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);

  res.json({ success: true, data: { code: coupon.code, discount, type: coupon.type, value: coupon.value } });
});

export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const data = { ...req.body, userId: req.user!.id };
  if (data.isDefault) {
    await prisma.address.updateMany({ where: { userId: req.user!.id }, data: { isDefault: false } });
  }
  const address = await prisma.address.create({ data });
  res.status(201).json({ success: true, data: address });
});

export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const address = await prisma.address.findFirst({ where: { id: getParam(req.params.id), userId: req.user!.id } });
  if (!address) throw new AppError('Address not found', 404);
  if (req.body.isDefault) {
    await prisma.address.updateMany({ where: { userId: req.user!.id }, data: { isDefault: false } });
  }
  const updated = await prisma.address.update({ where: { id: address.id }, data: req.body });
  res.json({ success: true, data: updated });
});

export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  await prisma.address.deleteMany({ where: { id: getParam(req.params.id), userId: req.user!.id } });
  res.json({ success: true, message: 'Address deleted' });
});

export const addReview = asyncHandler(async (req: Request, res: Response) => {
  const { productId, rating, title, comment } = req.body;

  const review = await prisma.review.create({
    data: { productId, userId: req.user!.id, rating, title, comment },
  });

  const stats = await prisma.review.aggregate({
    where: { productId, status: 'APPROVED' },
    _avg: { rating: true },
    _count: true,
  });

  await prisma.product.update({
    where: { id: productId },
    data: { rating: stats._avg.rating || 0, reviewCount: stats._count },
  });

  res.status(201).json({ success: true, data: review });
});

export const subscribeNewsletter = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  await prisma.newsletter.upsert({
    where: { email },
    update: { isActive: true },
    create: { email },
  });
  res.json({ success: true, message: 'Successfully subscribed to newsletter' });
});
