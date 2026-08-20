import { Router } from 'express';
import { authenticate, optionalAuth, authorize } from '../middleware/auth';
import * as product from '../controllers/productController';
import * as admin from '../controllers/adminController';

const router = Router();

router.get('/', product.getProducts);
router.get('/featured', product.getFeatured);
router.get('/best-sellers', product.getBestSellers);
router.get('/new-arrivals', product.getNewArrivals);
router.get('/trending', product.getTrending);
router.get('/search', product.getSearchSuggestions);
router.get('/categories', product.getCategories);
router.get('/user/recently-viewed', authenticate, product.getRecentlyViewed);
router.get('/:productId/recommendations', product.getRecommendations);
router.get('/:slug', optionalAuth, product.getProduct);

router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), product.createProduct);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), product.updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), product.deleteProduct);

router.get('/banners/active', admin.getPublicBanners);

export default router;
