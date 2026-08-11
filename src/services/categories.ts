import prisma from '../lib/prisma';

export const getAllCategories = async () => {
  return prisma.category.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
  });
};

export const getCategoryById = async (id: string) => {
  return prisma.category.findFirst({
    where: { id, isDeleted: false },
  });
};

export const createCategory = async (data: { name: string }) => {
  return prisma.category.create({ data });
};

export const updateCategory = async (id: string, data: { name?: string }) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: string) => {
  return prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });
};
