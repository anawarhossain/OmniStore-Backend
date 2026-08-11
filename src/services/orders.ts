import prisma from '../lib/prisma';

export const getAllOrders = async () => {
  return await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getOrderById = async (id: string) => {
  return await prisma.order.findUnique({
    where: { id },
  });
};

export const createOrder = async (data: {
  userId: string;
  productId: string;
  quantity: number;
}) => {
  return await prisma.order.create({
    data,
  });
};

export const updateOrder = async (
  id: string,
  data: {
    userId?: string;
    productId?: string;
    quantity?: number;
    status?: string;
  }
) => {
  return await prisma.order.update({
    where: { id },
    data,
  });
};

export const deleteOrder = async (id: string) => {
  return await prisma.order.delete({
    where: { id },
  });
};
