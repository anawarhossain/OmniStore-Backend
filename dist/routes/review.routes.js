"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewService = __importStar(require("../services/reviews"));
const auth_1 = require("../middleware/auth");
const response_1 = require("../lib/response");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const { productId } = req.query;
        const reviews = productId
            ? await reviewService.getReviewsByProduct(productId)
            : await reviewService.getAllReviews();
        return (0, response_1.success)(res, 'Reviews retrieved successfully', reviews);
    }
    catch {
        return (0, response_1.fail)(res, 'Failed to fetch reviews', 500);
    }
});
router.get('/:id', async (req, res) => {
    try {
        const review = await reviewService.getReviewById(req.params.id);
        if (!review) {
            return (0, response_1.fail)(res, 'Review not found', 404);
        }
        return (0, response_1.success)(res, 'Review retrieved successfully', review);
    }
    catch {
        return (0, response_1.fail)(res, 'Failed to fetch review', 500);
    }
});
router.post('/', auth_1.authenticate, async (req, res) => {
    try {
        const { rating, comment, productId } = req.body;
        if (!rating || !productId) {
            return (0, response_1.fail)(res, 'Rating and product ID are required', 400);
        }
        if (rating < 1 || rating > 5) {
            return (0, response_1.fail)(res, 'Rating must be between 1 and 5', 400);
        }
        const review = await reviewService.createReview({
            rating,
            comment,
            userId: req.user.id,
            productId,
        });
        return (0, response_1.success)(res, 'Review created successfully', review, 201);
    }
    catch (error) {
        if (error.code === 'P2003') {
            return (0, response_1.fail)(res, 'Product does not exist', 400);
        }
        return (0, response_1.fail)(res, 'Failed to create review', 500);
    }
});
router.put('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        if (rating !== undefined && (rating < 1 || rating > 5)) {
            return (0, response_1.fail)(res, 'Rating must be between 1 and 5', 400);
        }
        const review = await reviewService.updateReview(req.params.id, {
            rating,
            comment,
        });
        return (0, response_1.success)(res, 'Review updated successfully', review);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return (0, response_1.fail)(res, 'Review not found', 404);
        }
        return (0, response_1.fail)(res, 'Failed to update review', 500);
    }
});
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        await reviewService.deleteReview(req.params.id);
        return (0, response_1.success)(res, 'Review deleted successfully', null);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return (0, response_1.fail)(res, 'Review not found', 404);
        }
        return (0, response_1.fail)(res, 'Failed to delete review', 500);
    }
});
exports.default = router;
