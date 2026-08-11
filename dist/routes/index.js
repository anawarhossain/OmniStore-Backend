"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_1 = require("../lib/response");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const review_routes_1 = __importDefault(require("./review.routes"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    return (0, response_1.success)(res, 'OmniStore Backend API is running', {
        status: 'OK',
        endpoints: [
            '/api/auth',
            '/api/users',
            '/api/categories',
            '/api/products',
            '/api/orders',
            '/api/reviews',
        ],
    });
});
router.use('/auth', auth_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/categories', category_routes_1.default);
router.use('/products', product_routes_1.default);
router.use('/orders', order_routes_1.default);
router.use('/reviews', review_routes_1.default);
exports.default = router;
