"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const auth_service_1 = require("../../services/auth.service");
const data_source_1 = require("../../utils/data-source");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_entity_1 = require("../../entities/User.entity");
process.env.ACCESS_TOKEN_SECRET = 'test-secret-key-for-jwt-signing';
// Mock dependencies
vitest_1.vi.mock('../../utils/data-source', () => ({
    AppDataSource: {
        getRepository: vitest_1.vi.fn(),
    },
}));
vitest_1.vi.mock('bcryptjs', () => ({
    default: {
        hash: vitest_1.vi.fn().mockResolvedValue('hashedPassword'),
        compare: vitest_1.vi.fn().mockResolvedValue(true),
    },
}));
(0, vitest_1.describe)('authService', () => {
    const mockUserRepo = {
        findOne: vitest_1.vi.fn(),
        create: vitest_1.vi.fn().mockImplementation((data) => ({ id: 'user-1', ...data })),
        save: vitest_1.vi.fn(),
    };
    const mockTokenRepo = {
        create: vitest_1.vi.fn().mockImplementation((data) => ({ id: 'token-1', ...data })),
        save: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        data_source_1.AppDataSource.getRepository.mockImplementation((entity) => {
            if (entity.name === 'User')
                return mockUserRepo;
            if (entity.name === 'RefreshToken')
                return mockTokenRepo;
        });
    });
    (0, vitest_1.describe)('register', () => {
        (0, vitest_1.it)('should successfully register a new user and return tokens', async () => {
            mockUserRepo.findOne.mockResolvedValue(null);
            const data = {
                email: 'test@test.com',
                password: 'password123',
                name: 'Test User',
            };
            const result = await auth_service_1.authService.register(data);
            (0, vitest_1.expect)(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { email: data.email } });
            (0, vitest_1.expect)(bcryptjs_1.default.hash).toHaveBeenCalledWith(data.password, 12);
            (0, vitest_1.expect)(mockUserRepo.save).toHaveBeenCalled();
            (0, vitest_1.expect)(mockTokenRepo.save).toHaveBeenCalled();
            (0, vitest_1.expect)(result.tokens).toHaveProperty('accessToken');
            (0, vitest_1.expect)(result.tokens).toHaveProperty('refreshToken');
            (0, vitest_1.expect)(result.user).toEqual({
                id: 'user-1',
                email: data.email,
                name: data.name,
                provider: User_entity_1.AuthProvider.CREDENTIALS,
            });
        });
        (0, vitest_1.it)('should throw 409 if email already exists', async () => {
            mockUserRepo.findOne.mockResolvedValue({ id: 'user-1', email: 'test@test.com' });
            await (0, vitest_1.expect)(auth_service_1.authService.register({
                email: 'test@test.com',
                password: 'password123',
                name: 'Test User',
            })).rejects.toEqual({ status: 409, message: 'A user with this email already exists.' });
        });
    });
});
