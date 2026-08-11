"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllCategories = async () => {
    return await prisma_1.default.category.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (id) => {
    return await prisma_1.default.category.findUnique({
        where: { id },
    });
};
exports.getCategoryById = getCategoryById;
const createCategory = async (data) => {
    return await prisma_1.default.category.create({
        data,
    });
};
exports.createCategory = createCategory;
const updateCategory = async (id, data) => {
    return await prisma_1.default.category.update({
        where: { id },
        data,
    });
};
exports.updateCategory = updateCategory;
const deleteCategory = async (id) => {
    return await prisma_1.default.category.delete({
        where: { id },
    });
};
exports.deleteCategory = deleteCategory;
