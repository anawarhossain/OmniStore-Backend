"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.getOrderById = exports.getAllOrders = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllOrders = async () => {
    return await prisma_1.default.order.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
};
exports.getAllOrders = getAllOrders;
const getOrderById = async (id) => {
    return await prisma_1.default.order.findUnique({
        where: { id },
    });
};
exports.getOrderById = getOrderById;
const createOrder = async (data) => {
    return await prisma_1.default.order.create({
        data,
    });
};
exports.createOrder = createOrder;
const updateOrder = async (id, data) => {
    return await prisma_1.default.order.update({
        where: { id },
        data,
    });
};
exports.updateOrder = updateOrder;
const deleteOrder = async (id) => {
    return await prisma_1.default.order.delete({
        where: { id },
    });
};
exports.deleteOrder = deleteOrder;
