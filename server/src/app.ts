import './instrument'; // must be first
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './utils/data-source';
import * as Sentry from '@sentry/node';
import { applySecurityMiddleware } from './middleware/security';
import { generalRateLimiter } from './middleware/rateLimiter';
import apiRoutes from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Apply Security Middleware (Helmet, CORS, CookieParser)
applySecurityMiddleware(app);

// General rate limiter for all non-auth routes (auth routes have their own)
app.use(generalRateLimiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Task Collaboration API' });
});

// API v1 Routes
app.use('/api/v1', apiRoutes);

// Sentry error handler must be registered after all routes
Sentry.setupExpressErrorHandler(app);

// Initialize Database Connection first, then start Express
if (process.env.NODE_ENV !== 'test') {
  AppDataSource.initialize()
    .then(() => {
      console.log('Successfully connected to Neon PostgreSQL DB!');

      // Start server only after database is ready
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Error during Data Source initialization:', error);
      process.exit(1); // Stop the server if database connection fails
    });
}

export default app;