import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../../services/auth.service';
import { AppDataSource } from '../../utils/data-source';
import bcrypt from 'bcryptjs';
import { AuthProvider } from '../../entities/User.entity';

process.env.ACCESS_TOKEN_SECRET = 'test-secret-key-for-jwt-signing';

// Mock dependencies
vi.mock('../../utils/data-source', () => ({
  AppDataSource: {
    getRepository: vi.fn(),
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashedPassword'),
    compare: vi.fn().mockResolvedValue(true),
  },
}));

describe('authService', () => {
  const mockUserRepo = {
    findOne: vi.fn(),
    create: vi.fn().mockImplementation((data) => ({ id: 'user-1', ...data })),
    save: vi.fn(),
  };

  const mockTokenRepo = {
    create: vi.fn().mockImplementation((data) => ({ id: 'token-1', ...data })),
    save: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (AppDataSource.getRepository as any).mockImplementation((entity: any) => {
      if (entity.name === 'User') return mockUserRepo;
      if (entity.name === 'RefreshToken') return mockTokenRepo;
    });
  });

  describe('register', () => {
    it('should successfully register a new user and return tokens', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      const data = {
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
      };

      const result = await authService.register(data);

      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { email: data.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(data.password, 12);
      expect(mockUserRepo.save).toHaveBeenCalled();
      expect(mockTokenRepo.save).toHaveBeenCalled();
      
      expect(result.tokens).toHaveProperty('accessToken');
      expect(result.tokens).toHaveProperty('refreshToken');
      expect(result.user).toEqual({
        id: 'user-1',
        email: data.email,
        name: data.name,
        provider: AuthProvider.CREDENTIALS,
      });
    });

    it('should throw 409 if email already exists', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 'user-1', email: 'test@test.com' });

      await expect(
        authService.register({
          email: 'test@test.com',
          password: 'password123',
          name: 'Test User',
        })
      ).rejects.toEqual({ status: 409, message: 'A user with this email already exists.' });
    });
  });
});
