"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const validation_schemas_1 = require("../../middleware/validation.schemas");
(0, vitest_1.describe)('Validation Schemas', () => {
    (0, vitest_1.describe)('registerSchema', () => {
        (0, vitest_1.it)('should validate correct input', () => {
            const data = {
                email: 'test@example.com',
                password: 'Password123!',
                name: 'Test User',
            };
            const result = validation_schemas_1.registerSchema.safeParse(data);
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.email).toBe('test@example.com');
            }
        });
        (0, vitest_1.it)('should reject invalid email', () => {
            const result = validation_schemas_1.registerSchema.safeParse({
                email: 'not-an-email',
                password: 'Password123!',
                name: 'Test User',
            });
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should reject weak password', () => {
            const result = validation_schemas_1.registerSchema.safeParse({
                email: 'test@example.com',
                password: 'weak',
                name: 'Test User',
            });
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should sanitize HTML from name', () => {
            const result = validation_schemas_1.registerSchema.safeParse({
                email: 'test@example.com',
                password: 'Password123!',
                name: '<script>alert(1)</script>Test User',
            });
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.name).toBe('Test User');
            }
        });
    });
    (0, vitest_1.describe)('createProjectSchema', () => {
        (0, vitest_1.it)('should validate and sanitize project details', () => {
            const data = {
                name: '  Project X <img src="x" onerror="alert(1)">  ',
                description: 'A great project',
            };
            const result = validation_schemas_1.createProjectSchema.safeParse(data);
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.name).toBe('Project X');
            }
        });
    });
});
