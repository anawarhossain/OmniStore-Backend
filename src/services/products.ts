import prisma from '../lib/prisma';

export const getAllProducts = async () => {
  return await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
  });
};

export const createProduct = async (data: {
  title: string;
  price: number;
}) => {
  return await prisma.product.create({
    data,
  });
};

export const updateProduct = async (
  id: string,
  data: {
    title?: string;
    price?: number;
  }
) => {
  return await prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: string) => {
  return await prisma.product.delete({
    where: { id },
  });
};
