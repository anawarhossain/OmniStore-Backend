import { Router } from 'express';
import * as userService from '../services/users';
import { authenticate, requireAdmin } from '../middleware/auth';
import { success, fail } from '../lib/response';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return success(res, 'Users retrieved successfully', users);
  } catch {
    return fail(res, 'Failed to fetch users', 500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id as string);
    if (!user) {
      return fail(res, 'User not found', 404);
    }
    return success(res, 'User retrieved successfully', user);
  } catch {
    return fail(res, 'Failed to fetch user', 500);
  }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, age, role } = req.body;
    if (!name || !email || !password) {
      return fail(res, 'Name, email, and password are required', 400);
    }
    const user = await userService.createUser({ name, email, password, age, role });
    return success(res, 'User created successfully', user, 201);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return fail(res, 'Email already exists', 409);
    }
    return fail(res, 'Failed to create user', 500);
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, email, age, password, role } = req.body;
    const user = await userService.updateUser(req.params.id as string, {
      name,
      email,
      age,
      password,
      role,
    });
    return success(res, 'User updated successfully', user);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return fail(res, 'User not found', 404);
    }
    if (error.code === 'P2002') {
      return fail(res, 'Email already exists', 409);
    }
    return fail(res, 'Failed to update user', 500);
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await userService.deleteUser(req.params.id as string);
    return success(res, 'User deleted successfully', null);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return fail(res, 'User not found', 404);
    }
    return fail(res, 'Failed to delete user', 500);
  }
});

export default router;
