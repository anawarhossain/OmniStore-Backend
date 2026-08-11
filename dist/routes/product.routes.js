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
const productService = __importStar(require("../services/products"));
const auth_1 = require("../middleware/auth");
const response_1 = require("../lib/response");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        return (0, response_1.success)(res, 'Products retrieved successfully', products);
    }
    catch {
        return (0, response_1.fail)(res, 'Failed to fetch products', 500);
    }
});
router.get('/:id', async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return (0, response_1.fail)(res, 'Product not found', 404);
        }
        return (0, response_1.success)(res, 'Product retrieved successfully', product);
    }
    catch {
        return (0, response_1.fail)(res, 'Failed to fetch product', 500);
    }
});
router.post('/', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { title, description, price, stock, categoryId, status } = req.body;
        if (!title || price === undefined || !categoryId) {
            return (0, response_1.fail)(res, 'Title, price, and categoryId are required', 400);
        }
        const product = await productService.createProduct({
            title,
            description,
            price,
            stock,
            categoryId,
            status,
        });
        return (0, response_1.success)(res, 'Product created successfully', product, 201);
    }
    catch (error) {
        if (error.code === 'P2003') {
            return (0, response_1.fail)(res, 'Category does not exist', 400);
        }
        return (0, response_1.fail)(res, 'Failed to create product', 500);
    }
});
router.put('/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { title, description, price, stock, categoryId, status } = req.body;
        const product = await productService.updateProduct(req.params.id, {
            title,
            description,
            price,
            stock,
            categoryId,
            status,
        });
        return (0, response_1.success)(res, 'Product updated successfully', product);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return (0, response_1.fail)(res, 'Product not found', 404);
        }
        if (error.code === 'P2003') {
            return (0, response_1.fail)(res, 'Category does not exist', 400);
        }
        return (0, response_1.fail)(res, 'Failed to update product', 500);
    }
});
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        return (0, response_1.success)(res, 'Product deleted successfully', null);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return (0, response_1.fail)(res, 'Product not found', 404);
        }
        return (0, response_1.fail)(res, 'Failed to delete product', 500);
    }
});
exports.default = router;
