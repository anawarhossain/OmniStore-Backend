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
const auth_1 = require("../middleware/auth");
const response_1 = require("../lib/response");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return (0, response_1.success)(res, 'Users retrieved successfully', users);
    }
    catch {
        return (0, response_1.fail)(res, 'Failed to fetch users', 500);
    }
});
router.get('/:id', async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return (0, response_1.fail)(res, 'User not found', 404);
        }
        return (0, response_1.success)(res, 'User retrieved successfully', user);
    }
    catch {
        return (0, response_1.fail)(res, 'Failed to fetch user', 500);
    }
});
router.post('/', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { name, email, password, age, role } = req.body;
        if (!name || !email || !password) {
            return (0, response_1.fail)(res, 'Name, email, and password are required', 400);
        }
        const user = await userService.createUser({ name, email, password, age, role });
        return (0, response_1.success)(res, 'User created successfully', user, 201);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return (0, response_1.fail)(res, 'Email already exists', 409);
        }
        return (0, response_1.fail)(res, 'Failed to create user', 500);
    }
});
router.put('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { name, email, age, password, role } = req.body;
        const user = await userService.updateUser(req.params.id, {
            name,
            email,
            age,
            password,
            role,
        });
        return (0, response_1.success)(res, 'User updated successfully', user);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return (0, response_1.fail)(res, 'User not found', 404);
        }
        if (error.code === 'P2002') {
            return (0, response_1.fail)(res, 'Email already exists', 409);
        }
        return (0, response_1.fail)(res, 'Failed to update user', 500);
    }
});
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        return (0, response_1.success)(res, 'User deleted successfully', null);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return (0, response_1.fail)(res, 'User not found', 404);
        }
        return (0, response_1.fail)(res, 'Failed to delete user', 500);
    }
});
exports.default = router;
