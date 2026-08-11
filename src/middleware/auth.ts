import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';
import { fail } from '../lib/response';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return fail(res, 'Authentication required', 401);
  }

  const token = header.split(' ')[1];
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return fail(res, 'Invalid or expired token', 401);
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN') {
    return fail(res, 'Admin access required', 403);
  }
  next();
};
