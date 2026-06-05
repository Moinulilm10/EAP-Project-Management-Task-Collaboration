import { Router } from "express";
import { projectController } from "../controllers/project.controller";
import { requireAuth } from "../middleware/auth";
import { idempotency } from "../middleware/idempotency";
import { validate } from "../middleware/validate";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../middleware/validation.schemas";

const router = Router();

// All project routes require authentication
router.use(requireAuth);

router.get("/", projectController.getAll);
router.get("/:id", projectController.getById);

router.post(
  "/",
  idempotency,
  validate(createProjectSchema),
  projectController.create,
);

router.put(
  "/:id",
  idempotency,
  validate(updateProjectSchema),
  projectController.update,
);

router.delete("/:id", idempotency, projectController.delete);

export default router;
