import { Router } from 'express';
import * as categoryService from '../services/categories';
import { authenticate, requireAdmin } from '../middleware/auth';
import { success, fail } from '../lib/response';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    return success(res, 'Categories retrieved successfully', categories);
  } catch {
    return fail(res, 'Failed to fetch categories', 500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id as string);
    if (!category) {
      return fail(res, 'Category not found', 404);
    }
    return success(res, 'Category retrieved successfully', category);
  } catch {
    return fail(res, 'Failed to fetch category', 500);
  }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return fail(res, 'Name is required', 400);
    }
    const category = await categoryService.createCategory({ name });
    return success(res, 'Category created successfully', category, 201);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return fail(res, 'Category name already exists', 409);
    }
    return fail(res, 'Failed to create category', 500);
  }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    const category = await categoryService.updateCategory(req.params.id as string, { name });
    return success(res, 'Category updated successfully', category);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return fail(res, 'Category not found', 404);
    }
    if (error.code === 'P2002') {
      return fail(res, 'Category name already exists', 409);
    }
    return fail(res, 'Failed to update category', 500);
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id as string);
    return success(res, 'Category deleted successfully', null);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return fail(res, 'Category not found', 404);
    }
    return fail(res, 'Failed to delete category', 500);
  }
});

export default router;
