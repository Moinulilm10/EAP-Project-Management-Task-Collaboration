import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../entities/User.entity';

// ─── Typed Auth Request ─────────────────────────────────────────────────────

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// ─── JWT Access Token Verification ──────────────────────────────────────────

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired access token.' });
  }
};

// ─── Role-Based Access Control Gate ─────────────────────────────────────────

/**
 * Middleware factory that restricts access to specified roles.
 * Must be placed AFTER requireAuth in the middleware chain.
 *
 * @example
 * router.post('/', requireAuth, requireRole(UserRole.ADMIN, UserRole.PROJECT_MANAGER), handler);
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
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