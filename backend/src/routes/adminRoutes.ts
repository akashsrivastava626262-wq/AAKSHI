import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import * as admin from '../controllers/adminController';
import * as product from '../controllers/productController';

const router = Router();

router.use(authenticate, authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/dashboard', admin.getDashboard);
router.get('/orders', admin.getAllOrders);
router.put('/orders/:id', admin.updateOrderStatus);
router.get('/customers', admin.getAllCustomers);
router.get('/products', admin.getAllProducts);
router.get('/coupons', admin.getCoupons);
router.post('/coupons', admin.createCoupon);
router.put('/coupons/:id', admin.updateCoupon);
router.get('/banners', admin.getBanners);
router.post('/banners', admin.createBanner);
router.put('/banners/:id', admin.updateBanner);
router.delete('/banners/:id', admin.deleteBanner);
router.get('/reviews', admin.getReviews);
router.put('/reviews/:id', admin.moderateReview);
router.get('/sales-report', admin.getSalesReport);
router.get('/categories', product.getCategories);
router.post('/categories', admin.createCategory);
router.put('/categories/:id', admin.updateCategory);

export default router;
