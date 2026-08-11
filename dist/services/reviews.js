"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.createReview = exports.getReviewsByProduct = exports.getReviewById = exports.getAllReviews = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllReviews = async () => {
    return prisma_1.default.review.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { id: true, name: true, email: true } },
            product: { select: { id: true, title: true, price: true } },
        },
    });
};
exports.getAllReviews = getAllReviews;
const getReviewById = async (id) => {
    return prisma_1.default.review.findFirst({
        where: { id, isDeleted: false },
        include: {
            user: { select: { id: true, name: true, email: true } },
            product: { select: { id: true, title: true, price: true } },
        },
    });
};
exports.getReviewById = getReviewById;
const getReviewsByProduct = async (productId) => {
    return prisma_1.default.review.findMany({
        where: { productId, isDeleted: false },
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { id: true, name: true, email: true } },
        },
    });
};
exports.getReviewsByProduct = getReviewsByProduct;
const createReview = async (data) => {
    return prisma_1.default.review.create({
        data,
        include: {
            user: { select: { id: true, name: true, email: true } },
            product: { select: { id: true, title: true, price: true } },
        },
    });
};
exports.createReview = createReview;
const updateReview = async (id, data) => {
    return prisma_1.default.review.update({
        where: { id },
        data,
        include: {
            user: { select: { id: true, name: true, email: true } },
            product: { select: { id: true, title: true, price: true } },
        },
    });
};
exports.updateReview = updateReview;
const deleteReview = async (id) => {
    return prisma_1.default.review.update({
        where: { id },
        data: { isDeleted: true },
    });
};
exports.deleteReview = deleteReview;
