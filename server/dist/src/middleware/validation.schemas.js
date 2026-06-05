"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatusSchema = exports.updateTaskSchema = exports.createTaskSchema = exports.updateProjectSchema = exports.createProjectSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const sanitizedString = (minLen, maxLen) => zod_1.z
    .string()
    .min(minLen)
    .max(maxLen)
    .transform((val) => val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim());
// ─── Auth Schemas ───────────────────────────────────────────────────────────
exports.registerSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email('Invalid email format')
        .max(255)
        .transform((v) => v.toLowerCase().trim()),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be at most 128 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|:;"'<>,.?/~`])/, 'Password must contain uppercase, lowercase, number, and special character'),
    name: sanitizedString(2, 100),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email('Invalid email format')
        .max(255)
        .transform((v) => v.toLowerCase().trim()),
    password: zod_1.z.string().min(1, 'Password is required').max(128),
});
// ─── Project Schemas ────────────────────────────────────────────────────────
exports.createProjectSchema = zod_1.z.object({
    name: sanitizedString(2, 200),
    description: sanitizedString(0, 2000).optional().nullable(),
    deadline: zod_1.z
        .string()
        .datetime({ message: 'Invalid ISO 8601 date' })
        .optional()
        .nullable(),
    status: zod_1.z.enum(['active', 'completed', 'on_hold']).optional(),
});
exports.updateProjectSchema = exports.createProjectSchema.partial();
// ─── Task Schemas ───────────────────────────────────────────────────────────
exports.createTaskSchema = zod_1.z.object({
    title: sanitizedString(2, 200),
    description: sanitizedString(0, 5000).optional().nullable(),
    priority: zod_1.z.enum(['low', 'medium', 'high', 'critical']).optional(),
    status: zod_1.z.enum(['todo', 'in_progress', 'review', 'done']).optional(),
    assigneeId: zod_1.z.string().uuid('Invalid assignee UUID').optional().nullable(),
    projectId: zod_1.z.string().uuid('Invalid project UUID'),
    dueDate: zod_1.z
        .string()
        .datetime({ message: 'Invalid ISO 8601 date' })
        .optional()
        .nullable(),
});
exports.updateTaskSchema = exports.createTaskSchema.partial().omit({ projectId: true });
/** Team Members can only update task status — nothing else */
exports.updateTaskStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['todo', 'in_progress', 'review', 'done']),
});
