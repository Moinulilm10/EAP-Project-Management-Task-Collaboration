"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const auth_1 = require("../../middleware/auth");
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
            const userPayload = { id: '1', email: 'test@test.com' };
            const req = { headers: { authorization: 'Bearer valid_token' } };
            const res = {};
            const next = vitest_1.vi.fn();
            jsonwebtoken_1.default.verify.mockReturnValue(userPayload);
            (0, auth_1.requireAuth)(req, res, next);
            (0, vitest_1.expect)(req.user).toEqual(userPayload);
            (0, vitest_1.expect)(next).toHaveBeenCalled();
        });
    });
});
