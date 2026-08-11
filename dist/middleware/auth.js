"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.authenticate = void 0;
const jwt_1 = require("../lib/jwt");
const response_1 = require("../lib/response");
const authenticate = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return (0, response_1.fail)(res, 'Authentication required', 401);
    }
    const token = header.split(' ')[1];
    try {
        req.user = (0, jwt_1.verifyToken)(token);
        next();
    }
    catch {
        return (0, response_1.fail)(res, 'Invalid or expired token', 401);
    }
};
exports.authenticate = authenticate;
const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'ADMIN') {
        return (0, response_1.fail)(res, 'Admin access required', 403);
    }
    next();
};
exports.requireAdmin = requireAdmin;
