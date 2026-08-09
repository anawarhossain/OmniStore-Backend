import prisma from '../lib/prisma';

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const createUser = async (data: {
  name: string;
  email: string;
  age: number;
}) => {
  return await prisma.user.create({
    data,
  });
};

export const updateUser = async (
  id: string,
  data: {
    name?: string;
    email?: string;
    age?: number;
  }
) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id: string) => {
  return await prisma.user.delete({
    where: { id },
  });
};
