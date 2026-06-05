import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { requireAuth, requireRole } from '../middleware/auth';
import { UserRole } from '../entities/User.entity';
import { idempotency } from '../middleware/idempotency';
import { validate } from '../middleware/validate';
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from '../middleware/validation.schemas';
import { AuthenticatedRequest } from '../middleware/auth';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// All task routes require authentication
router.use(requireAuth);

router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);

router.post(
  '/',
  requireRole(UserRole.ADMIN, UserRole.PROJECT_MANAGER),
  idempotency,
  validate(createTaskSchema),
  taskController.create
);

/**
 * PUT /tasks/:id — Role-aware validation:
 * - Admin/PM → full updateTaskSchema
 * - Team Member → updateTaskStatusSchema (status field only)
 */
router.put(
  '/:id',
  idempotency,
  (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    const schema =
      authReq.user?.role === UserRole.TEAM_MEMBER
        ? updateTaskStatusSchema
        : updateTaskSchema;
    validate(schema)(req, res, next);
  },
  taskController.update
);

router.delete(
  '/:id',
  requireRole(UserRole.ADMIN),
  idempotency,
  taskController.delete
);

export default router;
