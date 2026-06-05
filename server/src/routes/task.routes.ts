import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { requireAuth } from "../middleware/auth";
import { idempotency } from "../middleware/idempotency";
import { validate } from "../middleware/validate";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../middleware/validation.schemas";

const router = Router();

// All task routes require authentication
router.use(requireAuth);

router.get("/", taskController.getAll);
router.get("/:id", taskController.getById);

router.post(
  "/",
  idempotency,
  validate(createTaskSchema),
  taskController.create,
);

router.put(
  "/:id",
  idempotency,
  validate(updateTaskSchema),
  taskController.update,
);

router.delete("/:id", idempotency, taskController.delete);

export default router;
