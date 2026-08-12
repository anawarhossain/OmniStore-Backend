"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderService = __importStar(require("../services/orders"));
const auth_1 = require("../middleware/auth");
const response_1 = require("../lib/response");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        return (0, response_1.success)(res, 'Orders retrieved successfully', orders);
    }
    catch {
        return (0, response_1.fail)(res, 'Failed to fetch orders', 500);
    }
});
router.get('/:id', async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        if (!order) {
            return (0, response_1.fail)(res, 'Order not found', 404);
        }
        return (0, response_1.success)(res, 'Order retrieved successfully', order);
    }
    catch {
        return (0, response_1.fail)(res, 'Failed to fetch order', 500);
    }
});
router.post('/', auth_1.authenticate, async (req, res) => {
    try {
        const { userId, productId, quantity, status } = req.body;
        if (!userId || !productId || !quantity) {
            return (0, response_1.fail)(res, 'User ID, product ID, and quantity are required', 400);
        }
        const order = await orderService.createOrder({
            userId,
            productId,
            quantity,
            status,
        });
        return (0, response_1.success)(res, 'Order created successfully', order, 201);
    }
    catch (error) {
        if (error.code === 'P2003') {
            return (0, response_1.fail)(res, 'User or product does not exist', 400);
        }
        return (0, response_1.fail)(res, 'Failed to create order', 500);
    }
});
router.put('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { userId, productId, quantity, status } = req.body;
        if (status && req.user?.role !== 'ADMIN') {
            return (0, response_1.fail)(res, 'Only admins can update order status', 403);
        }
        const order = await orderService.updateOrder(req.params.id, {
            userId,
            productId,
            quantity,
            status,
        });
        return (0, response_1.success)(res, 'Order updated successfully', order);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return (0, response_1.fail)(res, 'Order not found', 404);
        }
        if (error.code === 'P2003') {
            return (0, response_1.fail)(res, 'User or product does not exist', 400);
        }
        return (0, response_1.fail)(res, 'Failed to update order', 500);
    }
});
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        await orderService.deleteOrder(req.params.id);
        return (0, response_1.success)(res, 'Order deleted successfully', null);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return (0, response_1.fail)(res, 'Order not found', 404);
        }
        return (0, response_1.fail)(res, 'Failed to delete order', 500);
    }
});
exports.default = router;
