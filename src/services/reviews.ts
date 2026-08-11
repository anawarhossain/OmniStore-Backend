import prisma from '../lib/prisma';

export const getAllReviews = async () => {
  return prisma.review.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, title: true, price: true } },
    },
  });
};

export const getReviewById = async (id: string) => {
  return prisma.review.findFirst({
    where: { id, isDeleted: false },
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, title: true, price: true } },
    },
  });
};

export const getReviewsByProduct = async (productId: string) => {
  return prisma.review.findMany({
    where: { productId, isDeleted: false },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
};

export const createReview = async (data: {
  rating: number;
  comment?: string;
  userId: string;
  productId: string;
}) => {
  return prisma.review.create({
    data,
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, title: true, price: true } },
    },
  });
};

export const updateReview = async (
  id: string,
  data: {
    rating?: number;
    comment?: string;
  }
) => {
  return prisma.review.update({
    where: { id },
    data,
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, title: true, price: true } },
    },
  });
};

export const deleteReview = async (id: string) => {
  return prisma.review.update({
    where: { id },
    data: { isDeleted: true },
  });
};
