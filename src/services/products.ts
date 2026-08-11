import prisma from '../lib/prisma';

export const getAllProducts = async () => {
  return prisma.product.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { id: true, name: true } },
    },
  });
};

export const getProductById = async (id: string) => {
  return prisma.product.findFirst({
    where: { id, isDeleted: false },
    include: {
      category: { select: { id: true, name: true } },
    },
  });
};

export const createProduct = async (data: {
  title: string;
  description?: string;
  price: number;
  stock?: number;
  categoryId: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
}) => {
  return prisma.product.create({
    data,
    include: {
      category: { select: { id: true, name: true } },
    },
  });
};

export const updateProduct = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    price?: number;
    stock?: number;
    categoryId?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  }
) => {
  return prisma.product.update({
    where: { id },
    data,
    include: {
      category: { select: { id: true, name: true } },
    },
  });
};

export const deleteProduct = async (id: string) => {
  return prisma.product.update({
    where: { id },
    data: { isDeleted: true },
  });
};
