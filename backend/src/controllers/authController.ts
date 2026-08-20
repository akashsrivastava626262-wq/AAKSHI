import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { hashPassword, comparePassword, validatePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError, asyncHandler } from '../middleware/errorHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name, phone } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already registered', 409);

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) throw new AppError(passwordValidation.message!, 400);

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name, phone },
    select: { id: true, email: true, name: true, role: true, loyaltyPoints: true, referralCode: true },
  });

  const tokens = {
    accessToken: generateAccessToken({ userId: user.id, email: user.email, role: user.role }),
    refreshToken: generateRefreshToken({ userId: user.id, email: user.email, role: user.role }),
  };

  res.status(201).json({ success: true, message: 'Registration successful', data: { user, ...tokens } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) throw new AppError('Invalid email or password', 401);
  if (!user.isActive) throw new AppError('Account is deactivated', 403);

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new AppError('Invalid email or password', 401);

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const tokens = {
    accessToken: generateAccessToken({ userId: user.id, email: user.email, role: user.role }),
    refreshToken: generateRefreshToken({ userId: user.id, email: user.email, role: user.role }),
  };

  res.json({
    success: true,
    data: {
      user: { id: user.id, email: user.email, name: user.name, role: user.role, loyaltyPoints: user.loyaltyPoints },
      ...tokens,
    },
  });
});

export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  const { googleId, email, name, avatar } = req.body;

  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId }, { email }] },
  });

  if (user) {
    if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, avatar: avatar || user.avatar, emailVerified: true },
      });
    }
  } else {
    user = await prisma.user.create({
      data: { googleId, email, name, avatar, emailVerified: true },
    });
  }

  const tokens = {
    accessToken: generateAccessToken({ userId: user.id, email: user.email, role: user.role }),
    refreshToken: generateRefreshToken({ userId: user.id, email: user.email, role: user.role }),
  };

  res.json({
    success: true,
    data: {
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
      ...tokens,
    },
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;
  if (!token) throw new AppError('Refresh token required', 400);

  const payload = verifyRefreshToken(token);
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || !user.isActive) throw new AppError('Invalid refresh token', 401);

  const tokens = {
    accessToken: generateAccessToken({ userId: user.id, email: user.email, role: user.role }),
    refreshToken: generateRefreshToken({ userId: user.id, email: user.email, role: user.role }),
  };

  res.json({ success: true, data: tokens });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true, email: true, name: true, phone: true, avatar: true, role: true,
      loyaltyPoints: true, referralCode: true, emailVerified: true, createdAt: true,
      addresses: true,
    },
  });
  res.json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, avatar } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { name, phone, avatar },
    select: { id: true, email: true, name: true, phone: true, avatar: true, loyaltyPoints: true },
  });
  res.json({ success: true, data: user });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user?.password) throw new AppError('Cannot change password for social login accounts', 400);

  const isValid = await comparePassword(currentPassword, user.password);
  if (!isValid) throw new AppError('Current password is incorrect', 400);

  const validation = validatePassword(newPassword);
  if (!validation.valid) throw new AppError(validation.message!, 400);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await hashPassword(newPassword) },
  });

  res.json({ success: true, message: 'Password updated successfully' });
});
