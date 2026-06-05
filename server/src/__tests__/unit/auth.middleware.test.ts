import { describe, it, expect, vi } from 'vitest';
import { requireAuth } from '../../middleware/auth';
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
      const userPayload = { id: '1', email: 'test@test.com' };
      const req: any = { headers: { authorization: 'Bearer valid_token' } };
      const res: any = {};
      const next = vi.fn();

      (jwt.verify as any).mockReturnValue(userPayload);

      requireAuth(req, res, next);

      expect(req.user).toEqual(userPayload);
      expect(next).toHaveBeenCalled();
    });
  });
});
