"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ─── JWT Access Token Verification ──────────────────────────────────────────
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid or expired access token.' });
    }
};
exports.requireAuth = requireAuth;
// ─── Role-Based Access Control Gate ─────────────────────────────────────────
/**
 * Middleware factory that restricts access to specified roles.
 * Must be placed AFTER requireAuth in the middleware chain.
 *
 * @example
 * router.post('/', requireAuth, requireRole(UserRole.ADMIN, UserRole.PROJECT_MANAGER), handler);
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required.' });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                error: 'Forbidden',
                message: `Role '${req.user.role}' does not have permission to access this resource. Required: ${allowedRoles.join(', ')}`,
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
