import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as cart from '../controllers/cartController';

const router = Router();

router.use(authenticate);

router.get('/', cart.getCart);
router.post('/', cart.addToCart);
router.put('/:id', cart.updateCartItem);
router.delete('/:id', cart.removeFromCart);
router.delete('/', cart.clearCart);

router.get('/wishlist', cart.getWishlist);
router.post('/wishlist', cart.addToWishlist);
router.delete('/wishlist/:productId', cart.removeFromWishlist);

export default router;
