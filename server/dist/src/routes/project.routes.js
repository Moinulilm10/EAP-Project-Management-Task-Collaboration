"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const auth_1 = require("../middleware/auth");
const User_entity_1 = require("../entities/User.entity");
const idempotency_1 = require("../middleware/idempotency");
const validate_1 = require("../middleware/validate");
const validation_schemas_1 = require("../middleware/validation.schemas");
const router = (0, express_1.Router)();
// All project routes require authentication
router.use(auth_1.requireAuth);
router.get('/', project_controller_1.projectController.getAll);
router.get('/:id', project_controller_1.projectController.getById);
router.post('/', (0, auth_1.requireRole)(User_entity_1.UserRole.ADMIN, User_entity_1.UserRole.PROJECT_MANAGER), idempotency_1.idempotency, (0, validate_1.validate)(validation_schemas_1.createProjectSchema), project_controller_1.projectController.create);
router.put('/:id', (0, auth_1.requireRole)(User_entity_1.UserRole.ADMIN, User_entity_1.UserRole.PROJECT_MANAGER), idempotency_1.idempotency, (0, validate_1.validate)(validation_schemas_1.updateProjectSchema), project_controller_1.projectController.update);
router.delete('/:id', (0, auth_1.requireRole)(User_entity_1.UserRole.ADMIN), idempotency_1.idempotency, project_controller_1.projectController.delete);
exports.default = router;
