import { Router } from 'express';
import * as reviewService from '../services/reviews';
import { authenticate } from '../middleware/auth';
import { success, fail } from '../lib/response';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { productId } = req.query;
    const reviews = productId
      ? await reviewService.getReviewsByProduct(productId as string)
      : await reviewService.getAllReviews();
    return success(res, 'Reviews retrieved successfully', reviews);
  } catch {
    return fail(res, 'Failed to fetch reviews', 500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const review = await reviewService.getReviewById(req.params.id as string);
    if (!review) {
      return fail(res, 'Review not found', 404);
    }
    return success(res, 'Review retrieved successfully', review);
  } catch {
    return fail(res, 'Failed to fetch review', 500);
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;
    if (!rating || !productId) {
      return fail(res, 'Rating and product ID are required', 400);
    }
    if (rating < 1 || rating > 5) {
      return fail(res, 'Rating must be between 1 and 5', 400);
    }
    const review = await reviewService.createReview({
      rating,
      comment,
      userId: req.user!.id,
      productId,
    });
    return success(res, 'Review created successfully', review, 201);
  } catch (error: any) {
    if (error.code === 'P2003') {
      return fail(res, 'Product does not exist', 400);
    }
    return fail(res, 'Failed to create review', 500);
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return fail(res, 'Rating must be between 1 and 5', 400);
    }
    const review = await reviewService.updateReview(req.params.id as string, {
      rating,
      comment,
    });
    return success(res, 'Review updated successfully', review);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return fail(res, 'Review not found', 404);
    }
    return fail(res, 'Failed to update review', 500);
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id as string);
    return success(res, 'Review deleted successfully', null);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return fail(res, 'Review not found', 404);
    }
    return fail(res, 'Failed to delete review', 500);
  }
});

export default router;
