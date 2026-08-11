"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllProducts = async () => {
    return prisma_1.default.product.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        include: {
            category: { select: { id: true, name: true } },
        },
    });
};
exports.getAllProducts = getAllProducts;
const getProductById = async (id) => {
    return prisma_1.default.product.findFirst({
        where: { id, isDeleted: false },
        include: {
            category: { select: { id: true, name: true } },
        },
    });
};
exports.getProductById = getProductById;
const createProduct = async (data) => {
    return prisma_1.default.product.create({
        data,
        include: {
            category: { select: { id: true, name: true } },
        },
    });
};
exports.createProduct = createProduct;
const updateProduct = async (id, data) => {
    return prisma_1.default.product.update({
        where: { id },
        data,
        include: {
            category: { select: { id: true, name: true } },
        },
    });
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    return prisma_1.default.product.update({
        where: { id },
        data: { isDeleted: true },
    });
};
exports.deleteProduct = deleteProduct;
