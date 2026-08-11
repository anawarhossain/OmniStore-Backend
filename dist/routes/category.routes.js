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
const categoryService = __importStar(require("../services/categories"));
const auth_1 = require("../middleware/auth");
const response_1 = require("../lib/response");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        return (0, response_1.success)(res, 'Categories retrieved successfully', categories);
    }
    catch {
        return (0, response_1.fail)(res, 'Failed to fetch categories', 500);
    }
});
router.get('/:id', async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        if (!category) {
            return (0, response_1.fail)(res, 'Category not found', 404);
        }
        return (0, response_1.success)(res, 'Category retrieved successfully', category);
    }
    catch {
        return (0, response_1.fail)(res, 'Failed to fetch category', 500);
    }
});
router.post('/', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return (0, response_1.fail)(res, 'Name is required', 400);
        }
        const category = await categoryService.createCategory({ name });
        return (0, response_1.success)(res, 'Category created successfully', category, 201);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return (0, response_1.fail)(res, 'Category name already exists', 409);
        }
        return (0, response_1.fail)(res, 'Failed to create category', 500);
    }
});
router.put('/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        const category = await categoryService.updateCategory(req.params.id, { name });
        return (0, response_1.success)(res, 'Category updated successfully', category);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return (0, response_1.fail)(res, 'Category not found', 404);
        }
        if (error.code === 'P2002') {
            return (0, response_1.fail)(res, 'Category name already exists', 409);
        }
        return (0, response_1.fail)(res, 'Failed to update category', 500);
    }
});
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        return (0, response_1.success)(res, 'Category deleted successfully', null);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return (0, response_1.fail)(res, 'Category not found', 404);
        }
        return (0, response_1.fail)(res, 'Failed to delete category', 500);
    }
});
exports.default = router;
