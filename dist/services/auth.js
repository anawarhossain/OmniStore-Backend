"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const jwt_1 = require("../lib/jwt");
const users_1 = require("./users");
const register = async (data) => {
    const user = await (0, users_1.createUser)(data);
    const token = (0, jwt_1.signToken)({ id: user.id, email: user.email, role: user.role });
    return { user, token };
};
exports.register = register;
const login = async (data) => {
    const user = await prisma_1.default.user.findFirst({
        where: { email: data.email, isDeleted: false },
    });
    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }
    const { password, ...safeUser } = user;
    const valid = await bcrypt_1.default.compare(data.password, password);
    if (!valid) {
        throw new Error('INVALID_CREDENTIALS');
    }
    const token = (0, jwt_1.signToken)({ id: safeUser.id, email: safeUser.email, role: safeUser.role });
    return { user: safeUser, token };
};
exports.login = login;
const getMe = async (id) => {
    return prisma_1.default.user.findFirst({
        where: { id, isDeleted: false },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            age: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
exports.getMe = getMe;
