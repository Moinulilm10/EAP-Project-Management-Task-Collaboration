"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const validate_1 = require("../middleware/validate");
const validation_schemas_1 = require("../middleware/validation.schemas");
const router = (0, express_1.Router)();
// All auth routes are rate-limited aggressively
router.post('/register', rateLimiter_1.authRateLimiter, (0, validate_1.validate)(validation_schemas_1.registerSchema), auth_controller_1.authController.register);
router.post('/login', rateLimiter_1.authRateLimiter, (0, validate_1.validate)(validation_schemas_1.loginSchema), auth_controller_1.authController.login);
router.post('/refresh', rateLimiter_1.authRateLimiter, auth_controller_1.authController.refresh);
router.post('/logout', auth_1.requireAuth, auth_controller_1.authController.logout);
router.get('/me', auth_1.requireAuth, auth_controller_1.authController.me);
// Google OAuth sync endpoint (called by NextAuth backend)
router.post('/google-sync', rateLimiter_1.authRateLimiter, auth_controller_1.authController.googleSync);
exports.default = router;
