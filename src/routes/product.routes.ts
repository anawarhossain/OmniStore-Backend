import { Router } from 'express';
import * as productService from '../services/products';
import { authenticate, requireAdmin } from '../middleware/auth';
import { success, fail } from '../lib/response';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    return success(res, 'Products retrieved successfully', products);
  } catch {
    return fail(res, 'Failed to fetch products', 500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id as string);
    if (!product) {
      return fail(res, 'Product not found', 404);
    }
    return success(res, 'Product retrieved successfully', product);
  } catch {
    return fail(res, 'Failed to fetch product', 500);
  }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { title, description, price, stock, categoryId, status } = req.body;
    if (!title || price === undefined || !categoryId) {
      return fail(res, 'Title, price, and categoryId are required', 400);
    }
    const product = await productService.createProduct({
      title,
      description,
      price,
      stock,
      categoryId,
      status,
    });
    return success(res, 'Product created successfully', product, 201);
  } catch (error: any) {
    if (error.code === 'P2003') {
      return fail(res, 'Category does not exist', 400);
    }
    return fail(res, 'Failed to create product', 500);
  }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { title, description, price, stock, categoryId, status } = req.body;
    const product = await productService.updateProduct(req.params.id as string, {
      title,
      description,
      price,
      stock,
      categoryId,
      status,
    });
    return success(res, 'Product updated successfully', product);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return fail(res, 'Product not found', 404);
    }
    if (error.code === 'P2003') {
      return fail(res, 'Category does not exist', 400);
    }
    return fail(res, 'Failed to update product', 500);
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id as string);
    return success(res, 'Product deleted successfully', null);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return fail(res, 'Product not found', 404);
    }
    return fail(res, 'Failed to delete product', 500);
  }
});

export default router;
