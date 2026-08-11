import { Router } from 'express';
import { register, login, getMe } from '../services/auth';
import { authenticate } from '../middleware/auth';
import { success, fail } from '../lib/response';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, age } = req.body;
    if (!name || !email || !password) {
      return fail(res, 'Name, email, and password are required', 400);
    }
    const result = await register({ name, email, password, age });
    return success(res, 'User registered successfully', result, 201);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return fail(res, 'Email already exists', 409);
    }
    return fail(res, 'Failed to register user', 500);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return fail(res, 'Email and password are required', 400);
    }
    const result = await login({ email, password });
    return success(res, 'Login successful', result);
  } catch (error: any) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return fail(res, 'Invalid email or password', 401);
    }
    return fail(res, 'Failed to login', 500);
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await getMe(req.user!.id);
    if (!user) {
      return fail(res, 'User not found', 404);
    }
    return success(res, 'User retrieved successfully', user);
  } catch {
    return fail(res, 'Failed to fetch user', 500);
  }
});

export default router;
