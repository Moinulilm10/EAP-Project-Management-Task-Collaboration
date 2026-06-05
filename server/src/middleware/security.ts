import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Express } from 'express';

/**
 * Applies all security-hardening middleware to the Express app.
 * Covers: Helmet (CSP, HSTS, X-Frame-Options, etc.), CORS, Cookie Parser.
 */
export function applySecurityMiddleware(app: Express): void {
  // ── Helmet: Sets numerous security HTTP headers ─────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
      // HSTS: 1 year, includeSubDomains, preload
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      // Prevent MIME-type sniffing
      xContentTypeOptions: true,
      // Prevent clickjacking
      frameguard: { action: 'deny' },
      // Referrer policy
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      // Prevent IE from executing downloads in site context
      ieNoOpen: true,
      // Disable DNS prefetching
      dnsPrefetchControl: { allow: false },
    })
  );

  // ── CORS: Locked to frontend origin only ────────────────────────────────
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Idempotency-Key',
        'X-Requested-With',
      ],
      maxAge: 86400, // 24h preflight cache
    })
  );

  // ── Cookie Parser: Signed cookies for refresh token transport ───────────
  app.use(cookieParser(process.env.COOKIE_SECRET || 'default-cookie-secret'));
}
