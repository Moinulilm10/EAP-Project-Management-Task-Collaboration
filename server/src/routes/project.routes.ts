import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { requireAuth, requireRole } from '../middleware/auth';
import { UserRole } from '../entities/User.entity';
import { idempotency } from '../middleware/idempotency';
import { validate } from '../middleware/validate';
import { createProjectSchema, updateProjectSchema } from '../middleware/validation.schemas';

const router = Router();

// All project routes require authentication
router.use(requireAuth);

router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);

router.post(
  '/',
  requireRole(UserRole.ADMIN, UserRole.PROJECT_MANAGER),
  idempotency,
  validate(createProjectSchema),
  projectController.create
);

router.put(
  '/:id',
  requireRole(UserRole.ADMIN, UserRole.PROJECT_MANAGER),
  idempotency,
  validate(updateProjectSchema),
  projectController.update
);

router.delete(
  '/:id',
  requireRole(UserRole.ADMIN),
  idempotency,
  projectController.delete
);

export default router;
