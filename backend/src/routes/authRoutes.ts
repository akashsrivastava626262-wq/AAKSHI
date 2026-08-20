import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import * as auth from '../controllers/authController';

const router = Router();

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').trim().notEmpty(),
  validate,
], auth.register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate,
], auth.login);

router.post('/google', [
  body('googleId').notEmpty(),
  body('email').isEmail(),
  body('name').trim().notEmpty(),
  validate,
], auth.googleAuth);

router.post('/refresh', auth.refreshToken);

router.get('/profile', authenticate, auth.getProfile);
router.put('/profile', authenticate, auth.updateProfile);
router.put('/change-password', authenticate, auth.changePassword);

export default router;
