import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { authService } from '../services/auth.service';

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/api/v1/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const authController = {
  async register(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { tokens, user } = await authService.register(req.body);

      res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
      res.status(201).json({
        accessToken: tokens.accessToken,
        user,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Registration failed.' });
    }
  },

  async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { tokens, user } = await authService.login(req.body.email, req.body.password);

      res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
      res.status(200).json({
        accessToken: tokens.accessToken,
        user,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Login failed.' });
    }
  },

  async refresh(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

      if (!rawRefreshToken) {
        res.status(401).json({ error: 'No refresh token provided.' });
        return;
      }

      const tokens = await authService.refreshTokens(rawRefreshToken);

      res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
      res.status(200).json({
        accessToken: tokens.accessToken,
      });
    } catch (error: any) {
      // Clear the cookie on any refresh failure
      res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/v1/auth' });
      res.status(error.status || 500).json({ error: error.message || 'Token refresh failed.' });
    }
  },

  async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
      if (rawRefreshToken) {
        await authService.logout(rawRefreshToken);
      }

      res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/v1/auth' });
      res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Logout failed.' });
    }
  },

  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated.' });
        return;
      }

      const profile = await authService.getProfile(req.user.id);
      res.status(200).json({ user: profile });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to get profile.' });
    }
  },

  /**
   * Backend endpoint for NextAuth Google OAuth sync.
   * Called by NextAuth signIn callback to create/link the Google user.
   */
  async googleSync(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { googleId, email, name } = req.body;
      const { tokens, user } = await authService.syncGoogleUser({ googleId, email, name });

      res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
      res.status(200).json({
        accessToken: tokens.accessToken,
        user,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Google sync failed.' });
    }
  },

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated.' });
        return;
      }
      const { name, picture } = req.body;
      const profile = await authService.updateProfile(req.user.id, { name, picture });
      res.status(200).json({ user: profile });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to update profile.' });
    }
  },
};
