import { Router } from 'express';
import { success } from '../lib/response';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import reviewRoutes from './review.routes';

const router = Router();

router.get('/', (req, res) => {
  return success(res, 'OmniStore Backend API is running', {
    status: 'OK',
    endpoints: [
      '/api/auth',
      '/api/users',
      '/api/categories',
      '/api/products',
      '/api/orders',
      '/api/reviews',
    ],
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);

export default router;
