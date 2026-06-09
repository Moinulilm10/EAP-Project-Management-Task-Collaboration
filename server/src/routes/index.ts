import { Router } from 'express';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import taskRoutes from './task.routes';
import teamRoutes from './team.routes';
import dashboardRoutes from './dashboard.routes';
import attachmentRoutes from './attachment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/teams', teamRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/attachments', attachmentRoutes);

export default router;
