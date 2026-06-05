"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const auth_1 = require("../../middleware/auth");
const User_entity_1 = require("../../entities/User.entity");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
vitest_1.vi.mock('jsonwebtoken');
(0, vitest_1.describe)('Auth Middleware', () => {
    (0, vitest_1.describe)('requireAuth', () => {
        (0, vitest_1.it)('should return 401 if no auth header', () => {
            const req = { headers: {} };
            const res = { status: vitest_1.vi.fn().mockReturnThis(), json: vitest_1.vi.fn() };
            const next = vitest_1.vi.fn();
            (0, auth_1.requireAuth)(req, res, next);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(401);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ error: 'Access denied. No token provided.' });
            (0, vitest_1.expect)(next).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)('should call next and set user on valid token', () => {
            const userPayload = { id: '1', email: 'test@test.com', role: User_entity_1.UserRole.TEAM_MEMBER };
            const req = { headers: { authorization: 'Bearer valid_token' } };
            const res = {};
            const next = vitest_1.vi.fn();
            jsonwebtoken_1.default.verify.mockReturnValue(userPayload);
            (0, auth_1.requireAuth)(req, res, next);
            (0, vitest_1.expect)(req.user).toEqual(userPayload);
            (0, vitest_1.expect)(next).toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)('requireRole', () => {
        (0, vitest_1.it)('should return 403 if user role is not allowed', () => {
            const req = { user: { role: User_entity_1.UserRole.TEAM_MEMBER } };
            const res = { status: vitest_1.vi.fn().mockReturnThis(), json: vitest_1.vi.fn() };
            const next = vitest_1.vi.fn();
            const middleware = (0, auth_1.requireRole)(User_entity_1.UserRole.ADMIN, User_entity_1.UserRole.PROJECT_MANAGER);
            middleware(req, res, next);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(403);
            (0, vitest_1.expect)(next).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)('should call next if user role is allowed', () => {
            const req = { user: { role: User_entity_1.UserRole.ADMIN } };
            const res = {};
            const next = vitest_1.vi.fn();
            const middleware = (0, auth_1.requireRole)(User_entity_1.UserRole.ADMIN, User_entity_1.UserRole.PROJECT_MANAGER);
            middleware(req, res, next);
            (0, vitest_1.expect)(next).toHaveBeenCalled();
        });
    });
});
