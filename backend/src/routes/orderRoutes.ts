import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import * as order from '../controllers/orderController';

const router = Router();

router.get('/track/:orderNumber', order.trackOrder);
router.post('/newsletter', [
  body('email').isEmail().normalizeEmail(),
  validate,
], order.subscribeNewsletter);

router.use(authenticate);

router.post('/', order.createOrder);
router.post('/verify-payment', order.verifyPayment);
router.post('/validate-coupon', order.validateCoupon);
router.get('/', order.getOrders);
router.get('/:id', order.getOrder);
router.post('/reviews', order.addReview);

router.post('/addresses', order.addAddress);
router.put('/addresses/:id', order.updateAddress);
router.delete('/addresses/:id', order.deleteAddress);

export default router;
