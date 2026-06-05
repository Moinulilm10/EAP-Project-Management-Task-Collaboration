import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  createProjectSchema,
} from '../../middleware/validation.schemas';

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate correct input', () => {
      const data = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      };
      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });

    it('should reject invalid email', () => {
      const result = registerSchema.safeParse({
        email: 'not-an-email',
        password: 'Password123!',
        name: 'Test User',
      });
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'weak',
        name: 'Test User',
      });
      expect(result.success).toBe(false);
    });

    it('should sanitize HTML from name', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123!',
        name: '<script>alert(1)</script>Test User',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Test User');
      }
    });
  });

  describe('createProjectSchema', () => {
    it('should validate and sanitize project details', () => {
      const data = {
        name: '  Project X <img src="x" onerror="alert(1)">  ',
        description: 'A great project',
      };
      const result = createProjectSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Project X');
      }
    });
  });
});
