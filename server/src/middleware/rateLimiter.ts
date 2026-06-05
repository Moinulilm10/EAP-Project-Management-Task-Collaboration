import rateLimit from 'express-rate-limit';

/**
 * Aggressive rate limiter for auth endpoints: 10 requests per 15 minutes per IP.
 * Targets brute-force login/registration attacks.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,   // Disable `X-RateLimit-*` headers
  message: {
    error: 'Too many requests',
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
  keyGenerator: (req) => {
    // Use X-Forwarded-For behind proxies, fall back to socket address
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
           req.socket.remoteAddress ||
           'unknown';
  },
});

/**
 * General rate limiter for all API endpoints: 100 requests per 15 minutes per IP.
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
  },
  keyGenerator: (req) => {
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
           req.socket.remoteAddress ||
           'unknown';
  },
});
