"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const auth_1 = require("../middleware/auth");
const User_entity_1 = require("../entities/User.entity");
const idempotency_1 = require("../middleware/idempotency");
const validate_1 = require("../middleware/validate");
const validation_schemas_1 = require("../middleware/validation.schemas");
const router = (0, express_1.Router)();
// All task routes require authentication
router.use(auth_1.requireAuth);
router.get('/', task_controller_1.taskController.getAll);
router.get('/:id', task_controller_1.taskController.getById);
router.post('/', (0, auth_1.requireRole)(User_entity_1.UserRole.ADMIN, User_entity_1.UserRole.PROJECT_MANAGER), idempotency_1.idempotency, (0, validate_1.validate)(validation_schemas_1.createTaskSchema), task_controller_1.taskController.create);
/**
 * PUT /tasks/:id — Role-aware validation:
 * - Admin/PM → full updateTaskSchema
 * - Team Member → updateTaskStatusSchema (status field only)
 */
router.put('/:id', idempotency_1.idempotency, (req, res, next) => {
    const authReq = req;
    const schema = authReq.user?.role === User_entity_1.UserRole.TEAM_MEMBER
        ? validation_schemas_1.updateTaskStatusSchema
        : validation_schemas_1.updateTaskSchema;
    (0, validate_1.validate)(schema)(req, res, next);
}, task_controller_1.taskController.update);
router.delete('/:id', (0, auth_1.requireRole)(User_entity_1.UserRole.ADMIN), idempotency_1.idempotency, task_controller_1.taskController.delete);
exports.default = router;
