"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllUsers = async () => {
    return await prisma_1.default.user.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
};
exports.getAllUsers = getAllUsers;
const getUserById = async (id) => {
    return await prisma_1.default.user.findUnique({
        where: { id },
    });
};
exports.getUserById = getUserById;
const createUser = async (data) => {
    return await prisma_1.default.user.create({
        data,
    });
};
exports.createUser = createUser;
const updateUser = async (id, data) => {
    return await prisma_1.default.user.update({
        where: { id },
        data,
    });
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    return await prisma_1.default.user.delete({
        where: { id },
    });
};
exports.deleteUser = deleteUser;
