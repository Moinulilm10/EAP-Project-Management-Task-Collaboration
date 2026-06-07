import { z } from 'zod';

const sanitizedString = (minLen: number, maxLen: number) =>
  z
    .string()
    .transform((val) =>
      val
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim()
    )
    .pipe(z.string().min(minLen).max(maxLen));

// ─── Auth Schemas ───────────────────────────────────────────────────────────

export const registerSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .max(255)
    .transform((v) => v.toLowerCase().trim()),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|:;"'<>,.?/~`])/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  name: sanitizedString(2, 100),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .max(255)
    .transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1, 'Password is required').max(128),
});

export const updateProfileSchema = z.object({
  name: sanitizedString(2, 100).optional(),
  picture: z.string().max(1000).optional().nullable(),
  bio: sanitizedString(0, 1000).optional().nullable(),
});

// ─── Project Schemas ────────────────────────────────────────────────────────

export const createProjectSchema = z.object({
  name: sanitizedString(2, 200),
  description: sanitizedString(0, 2000).optional().nullable(),
  deadline: z
    .string()
    .datetime({ message: 'Invalid ISO 8601 date' })
    .optional()
    .nullable(),
  status: z.enum(['active', 'completed', 'on_hold']).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

// ─── Task Schemas ───────────────────────────────────────────────────────────

export const createTaskSchema = z.object({
  title: sanitizedString(2, 200),
  description: sanitizedString(0, 5000).optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).optional(),
  assigneeId: z.string().uuid('Invalid assignee UUID').optional().nullable(),
  projectId: z.string().uuid('Invalid project UUID'),
  dueDate: z
    .string()
    .datetime({ message: 'Invalid ISO 8601 date' })
    .optional()
    .nullable(),
});

export const updateTaskSchema = createTaskSchema.partial().omit({ projectId: true });

/** Team Members can only update task status — nothing else */
export const updateTaskStatusSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'review', 'done']),
});
