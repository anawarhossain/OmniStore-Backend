import prisma from '../lib/prisma';

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getCategoryById = async (id: string) => {
  return await prisma.category.findUnique({
    where: { id },
  });
};

export const createCategory = async (data: { name: string }) => {
  return await prisma.category.create({
    data,
  });
};

export const updateCategory = async (
  id: string,
  data: {
    name?: string;
  }
) => {
  return await prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: { id },
  });
};
