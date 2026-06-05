"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
exports.authController = {
    async register(req, res) {
        try {
            const { tokens, user } = await auth_service_1.authService.register(req.body);
            res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
            res.status(201).json({
                accessToken: tokens.accessToken,
                user,
            });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Registration failed.' });
        }
    },
    async login(req, res) {
        try {
            const { tokens, user } = await auth_service_1.authService.login(req.body.email, req.body.password);
            res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
            res.status(200).json({
                accessToken: tokens.accessToken,
                user,
            });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Login failed.' });
        }
    },
    async refresh(req, res) {
        try {
            const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
            if (!rawRefreshToken) {
                res.status(401).json({ error: 'No refresh token provided.' });
                return;
            }
            const tokens = await auth_service_1.authService.refreshTokens(rawRefreshToken);
            res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
            res.status(200).json({
                accessToken: tokens.accessToken,
            });
        }
        catch (error) {
            // Clear the cookie on any refresh failure
            res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/v1/auth' });
            res.status(error.status || 500).json({ error: error.message || 'Token refresh failed.' });
        }
    },
    async logout(req, res) {
        try {
            const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
            if (rawRefreshToken) {
                await auth_service_1.authService.logout(rawRefreshToken);
            }
            res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/v1/auth' });
            res.status(200).json({ message: 'Logged out successfully.' });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Logout failed.' });
        }
    },
    async me(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Not authenticated.' });
                return;
            }
            const profile = await auth_service_1.authService.getProfile(req.user.id);
            res.status(200).json({ user: profile });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Failed to get profile.' });
        }
    },
    /**
     * Backend endpoint for NextAuth Google OAuth sync.
     * Called by NextAuth signIn callback to create/link the Google user.
     */
    async googleSync(req, res) {
        try {
            const { googleId, email, name } = req.body;
            const { tokens, user } = await auth_service_1.authService.syncGoogleUser({ googleId, email, name });
            res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
            res.status(200).json({
                accessToken: tokens.accessToken,
                user,
            });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Google sync failed.' });
        }
    },
};
