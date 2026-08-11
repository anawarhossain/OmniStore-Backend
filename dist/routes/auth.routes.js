"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../services/auth");
const auth_2 = require("../middleware/auth");
const response_1 = require("../lib/response");
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, age } = req.body;
        if (!name || !email || !password) {
            return (0, response_1.fail)(res, 'Name, email, and password are required', 400);
        }
        const result = await (0, auth_1.register)({ name, email, password, age });
        return (0, response_1.success)(res, 'User registered successfully', result, 201);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return (0, response_1.fail)(res, 'Email already exists', 409);
        }
        return (0, response_1.fail)(res, 'Failed to register user', 500);
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return (0, response_1.fail)(res, 'Email and password are required', 400);
        }
        const result = await (0, auth_1.login)({ email, password });
        return (0, response_1.success)(res, 'Login successful', result);
    }
    catch (error) {
        if (error.message === 'INVALID_CREDENTIALS') {
            return (0, response_1.fail)(res, 'Invalid email or password', 401);
        }
        return (0, response_1.fail)(res, 'Failed to login', 500);
    }
});
router.get('/me', auth_2.authenticate, async (req, res) => {
    try {
        const user = await (0, auth_1.getMe)(req.user.id);
        if (!user) {
            return (0, response_1.fail)(res, 'User not found', 404);
        }
        return (0, response_1.success)(res, 'User retrieved successfully', user);
    }
    catch {
        return (0, response_1.fail)(res, 'Failed to fetch user', 500);
    }
});
exports.default = router;
