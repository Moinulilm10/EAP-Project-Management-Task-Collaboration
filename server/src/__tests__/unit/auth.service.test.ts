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
        picture: null,
        bio: null,
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

  describe('getProfile', () => {
    it('should return the user profile if user exists', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'profile@example.com',
        name: 'Profile User',
        provider: AuthProvider.CREDENTIALS,
        picture: 'http://pic.jpg',
        bio: 'Hello bio',
      };
      mockUserRepo.findOne.mockResolvedValue(mockUser);

      const result = await authService.getProfile('user-123');

      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: 'user-123' } });
      expect(result).toEqual({
        id: 'user-123',
        email: 'profile@example.com',
        name: 'Profile User',
        provider: AuthProvider.CREDENTIALS,
        picture: 'http://pic.jpg',
        bio: 'Hello bio',
      });
    });

    it('should throw 404 if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(authService.getProfile('user-unknown')).rejects.toEqual({
        status: 404,
        message: 'User not found.',
      });
    });
  });

  describe('updateProfile', () => {
    it('should successfully update name, picture, and bio', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'profile@example.com',
        name: 'Old Name',
        provider: AuthProvider.CREDENTIALS,
        picture: 'http://old.jpg',
        bio: 'Old bio',
      };
      mockUserRepo.findOne.mockResolvedValue(mockUser);

      const result = await authService.updateProfile('user-123', {
        name: 'New Name',
        picture: 'http://new.jpg',
        bio: 'New bio',
      });

      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: 'user-123' } });
      expect(mockUserRepo.save).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New Name',
        picture: 'http://new.jpg',
        bio: 'New bio',
      }));
      expect(result).toEqual({
        id: 'user-123',
        email: 'profile@example.com',
        name: 'New Name',
        provider: AuthProvider.CREDENTIALS,
        picture: 'http://new.jpg',
        bio: 'New bio',
      });
    });

    it('should throw 404 if user to update does not exist', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(
        authService.updateProfile('user-unknown', { name: 'New Name' })
      ).rejects.toEqual({ status: 404, message: 'User not found.' });
    });
  });
});
