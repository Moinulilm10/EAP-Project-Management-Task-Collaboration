import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../middleware/validation.schemas';

const router = Router();

// All auth routes are rate-limited aggressively
router.post('/register', authRateLimiter, validate(registerSchema), authController.register);
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authRateLimiter, authController.refresh);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.me);
router.put('/me', requireAuth, authController.updateProfile);

// Google OAuth sync endpoint (called by NextAuth backend)
router.post('/google-sync', authRateLimiter, authController.googleSync);

export default router;
