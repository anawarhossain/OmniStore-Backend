"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllProducts = async () => {
    return await prisma_1.default.product.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
};
exports.getAllProducts = getAllProducts;
const getProductById = async (id) => {
    return await prisma_1.default.product.findUnique({
        where: { id },
    });
};
exports.getProductById = getProductById;
const createProduct = async (data) => {
    return await prisma_1.default.product.create({
        data,
    });
};
exports.createProduct = createProduct;
const updateProduct = async (id, data) => {
    return await prisma_1.default.product.update({
        where: { id },
        data,
    });
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    return await prisma_1.default.product.delete({
        where: { id },
    });
};
exports.deleteProduct = deleteProduct;
