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
const userService = __importStar(require("../services/users"));
const productService = __importStar(require("../services/products"));
const categoryService = __importStar(require("../services/categories"));
const orderService = __importStar(require("../services/orders"));
const router = (0, express_1.Router)();
// Health check
router.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'OmniStore Backend API is running' });
});
// User routes
router.get('/users', async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
router.get('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
router.post('/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        if (!name || !email || !age) {
            return res.status(400).json({ error: 'Name, email, and age are required' });
        }
        const user = await userService.createUser({ name, email, age });
        res.status(201).json(user);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
});
router.put('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, age } = req.body;
        const user = await userService.updateUser(id, { name, email, age });
        res.json(user);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to update user' });
    }
});
router.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await userService.deleteUser(id);
        res.status(204).send();
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(500).json({ error: 'Failed to delete user' });
    }
});
// Product routes
router.get('/products', async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
router.get('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productService.getProductById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});
router.post('/products', async (req, res) => {
    try {
        const { title, price } = req.body;
        if (!title || price === undefined) {
            return res.status(400).json({ error: 'Title and price are required' });
        }
        const product = await productService.createProduct({ title, price });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});
router.put('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { title, price } = req.body;
        const product = await productService.updateProduct(id, { title, price });
        res.json(product);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(500).json({ error: 'Failed to update product' });
    }
});
router.delete('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await productService.deleteProduct(id);
        res.status(204).send();
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(500).json({ error: 'Failed to delete product' });
    }
});
// Category routes
router.get('/categories', async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});
router.get('/categories/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const category = await categoryService.getCategoryById(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch category' });
    }
});
router.post('/categories', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const category = await categoryService.createCategory({ name });
        res.status(201).json(category);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Category name already exists' });
        }
        res.status(500).json({ error: 'Failed to create category' });
    }
});
router.put('/categories/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;
        const category = await categoryService.updateCategory(id, { name });
        res.json(category);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Category not found' });
        }
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Category name already exists' });
        }
        res.status(500).json({ error: 'Failed to update category' });
    }
});
router.delete('/categories/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await categoryService.deleteCategory(id);
        res.status(204).send();
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(500).json({ error: 'Failed to delete category' });
    }
});
// Order routes
router.get('/orders', async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});
router.get('/orders/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const order = await orderService.getOrderById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});
router.post('/orders', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        if (!userId || !productId || !quantity) {
            return res
                .status(400)
                .json({ error: 'User ID, product ID, and quantity are required' });
        }
        const order = await orderService.createOrder({ userId, productId, quantity });
        res.status(201).json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
});
router.put('/orders/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { userId, productId, quantity, status } = req.body;
        const order = await orderService.updateOrder(id, {
            userId,
            productId,
            quantity,
            status,
        });
        res.json(order);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(500).json({ error: 'Failed to update order' });
    }
});
router.delete('/orders/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await orderService.deleteOrder(id);
        res.status(204).send();
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(500).json({ error: 'Failed to delete order' });
    }
});
exports.default = router;
