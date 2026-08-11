"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const SALT_ROUNDS = 10;
const publicUser = {
    id: true,
    name: true,
    email: true,
    role: true,
    age: true,
    createdAt: true,
    updatedAt: true,
};
const getAllUsers = async () => {
    return prisma_1.default.user.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        select: publicUser,
    });
};
exports.getAllUsers = getAllUsers;
const getUserById = async (id) => {
    return prisma_1.default.user.findFirst({
        where: { id, isDeleted: false },
        select: publicUser,
    });
};
exports.getUserById = getUserById;
const createUser = async (data) => {
    const password = await bcrypt_1.default.hash(data.password, SALT_ROUNDS);
    return prisma_1.default.user.create({
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
exports.createUser = createUser;
const updateUser = async (id, data) => {
    const { password, ...rest } = data;
    const updateData = { ...rest };
    if (password) {
        updateData.password = await bcrypt_1.default.hash(password, SALT_ROUNDS);
    }
    return prisma_1.default.user.update({
        where: { id },
        data: updateData,
        select: publicUser,
    });
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    return prisma_1.default.user.update({
        where: { id },
        data: { isDeleted: true },
    });
};
exports.deleteUser = deleteUser;
