import { describe, it, expect, vi } from 'vitest';
import { requireAuth, requireRole } from '../../middleware/auth';
import { UserRole } from '../../entities/User.entity';
import jwt from 'jsonwebtoken';

vi.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  describe('requireAuth', () => {
    it('should return 401 if no auth header', () => {
      const req: any = { headers: {} };
      const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      requireAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access denied. No token provided.' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next and set user on valid token', () => {
      const userPayload = { id: '1', email: 'test@test.com', role: UserRole.TEAM_MEMBER };
      const req: any = { headers: { authorization: 'Bearer valid_token' } };
      const res: any = {};
      const next = vi.fn();

      (jwt.verify as any).mockReturnValue(userPayload);

      requireAuth(req, res, next);

      expect(req.user).toEqual(userPayload);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    it('should return 403 if user role is not allowed', () => {
      const req: any = { user: { role: UserRole.TEAM_MEMBER } };
      const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      const middleware = requireRole(UserRole.ADMIN, UserRole.PROJECT_MANAGER);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if user role is allowed', () => {
      const req: any = { user: { role: UserRole.ADMIN } };
      const res: any = {};
      const next = vi.fn();

      const middleware = requireRole(UserRole.ADMIN, UserRole.PROJECT_MANAGER);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
