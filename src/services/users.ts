import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

const SALT_ROUNDS = 10;

const publicUser = {
  id: true,
  name: true,
  email: true,
  role: true,
  age: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const getAllUsers = async () => {
  return prisma.user.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
    select: publicUser,
  });
};

export const getUserById = async (id: string) => {
  return prisma.user.findFirst({
    where: { id, isDeleted: false },
    select: publicUser,
  });
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  age?: number;
  role?: 'CUSTOMER' | 'ADMIN';
}) => {
  const password = await bcrypt.hash(data.password, SALT_ROUNDS);
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password,
      age: data.age,
      role: data.role,
    },
    select: publicUser,
  });
};

export const updateUser = async (
  id: string,
  data: {
    name?: string;
    email?: string;
    age?: number;
    password?: string;
    role?: 'CUSTOMER' | 'ADMIN';
  }
) => {
  const { password, ...rest } = data;
  const updateData: {
    name?: string;
    email?: string;
    age?: number;
    password?: string;
    role?: 'CUSTOMER' | 'ADMIN';
  } = { ...rest };

  if (password) {
    updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: publicUser,
  });
};

export const deleteUser = async (id: string) => {
  return prisma.user.update({
    where: { id },
    data: { isDeleted: true },
  });
};
