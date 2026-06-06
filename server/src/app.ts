import './instrument';
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
const PORT = process.env.PORT || 5005;

// Health check route (before CORS so any client can reach it)
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello EAP project is running' });
});

// Apply Security Middleware (Helmet, CORS, CookieParser)
applySecurityMiddleware(app);

// General rate limiter for all non-auth routes (auth routes have their own)
app.use(generalRateLimiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API v1 Routes
app.use('/api/v1', apiRoutes);

// Sentry error handler must be registered after all routes
Sentry.setupExpressErrorHandler(app);

import { Role } from './entities/Role.entity';
import { ProjectRoleName } from './entities/ProjectMember.entity';

async function seedRoles(): Promise<void> {
  try {
    const roleRepo = AppDataSource.getRepository(Role);
    const rolesToSeed = [
      ProjectRoleName.ADMIN,
      ProjectRoleName.PROJECT_MANAGER,
      ProjectRoleName.TEAM_MEMBER,
    ];

    for (const roleName of rolesToSeed) {
      const exists = await roleRepo.findOne({ where: { name: roleName } });
      if (!exists) {
        const newRole = roleRepo.create({ name: roleName });
        await roleRepo.save(newRole);
        console.log(`Seeded role: ${roleName}`);
      }
    }
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
}

// Initialize Database Connection first, then start Express
if (process.env.NODE_ENV !== 'test') {
  AppDataSource.initialize()
    .then(async () => {
      console.log('Successfully connected to Neon PostgreSQL DB!');
      
      // Ensure fixed roles are seeded in database
      await seedRoles();

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