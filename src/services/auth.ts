import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { signToken } from '../lib/jwt';
import { createUser } from './users';

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  age?: number;
}) => {
  const user = await createUser(data);
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { user, token };
};

export const login = async (data: { email: string; password: string }) => {
  const user = await prisma.user.findFirst({
    where: { email: data.email, isDeleted: false },
  });

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const { password, ...safeUser } = user;
  const valid = await bcrypt.compare(data.password, password);
  if (!valid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const token = signToken({ id: safeUser.id, email: safeUser.email, role: safeUser.role });
  return { user: safeUser, token };
};

export const getMe = async (id: string) => {
  return prisma.user.findFirst({
    where: { id, isDeleted: false },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      age: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
