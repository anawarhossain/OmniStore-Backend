import { Router } from 'express';
import * as orderService from '../services/orders';
import { authenticate } from '../middleware/auth';
import { success, fail } from '../lib/response';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    return success(res, 'Orders retrieved successfully', orders);
  } catch {
    return fail(res, 'Failed to fetch orders', 500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id as string);
    if (!order) {
      return fail(res, 'Order not found', 404);
    }
    return success(res, 'Order retrieved successfully', order);
  } catch {
    return fail(res, 'Failed to fetch order', 500);
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { userId, productId, quantity, status } = req.body;
    if (!userId || !productId || !quantity) {
      return fail(res, 'User ID, product ID, and quantity are required', 400);
    }
    const order = await orderService.createOrder({
      userId,
      productId,
      quantity,
      status,
    });
    return success(res, 'Order created successfully', order, 201);
  } catch (error: any) {
    if (error.code === 'P2003') {
      return fail(res, 'User or product does not exist', 400);
    }
    return fail(res, 'Failed to create order', 500);
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { userId, productId, quantity, status } = req.body;
    if (status && req.user?.role !== 'ADMIN') {
      return fail(res, 'Only admins can update order status', 403);
    }
    const order = await orderService.updateOrder(req.params.id as string, {
      userId,
      productId,
      quantity,
      status,
    });
    return success(res, 'Order updated successfully', order);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return fail(res, 'Order not found', 404);
    }
    if (error.code === 'P2003') {
      return fail(res, 'User or product does not exist', 400);
    }
    return fail(res, 'Failed to update order', 500);
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await orderService.deleteOrder(req.params.id as string);
    return success(res, 'Order deleted successfully', null);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return fail(res, 'Order not found', 404);
    }
    return fail(res, 'Failed to delete order', 500);
  }
});

export default router;
