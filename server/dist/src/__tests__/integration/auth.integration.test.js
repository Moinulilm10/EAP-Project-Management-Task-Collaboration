"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const data_source_1 = require("../../utils/data-source");
const User_entity_1 = require("../../entities/User.entity");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const test_setup_1 = require("../../utils/test-setup");
(0, vitest_1.describe)('Auth Integration', () => {
    (0, vitest_1.beforeAll)(async () => {
        await (0, test_setup_1.ensureTestSchema)();
        if (!data_source_1.AppDataSource.isInitialized) {
            await data_source_1.AppDataSource.initialize();
        }
        await data_source_1.AppDataSource.synchronize(true);
    }, 30000);
    (0, vitest_1.afterAll)(async () => {
        if (data_source_1.AppDataSource.isInitialized) {
            await data_source_1.AppDataSource.destroy();
        }
    });
    (0, vitest_1.it)('should register a new user', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/register').send({
            email: 'newuser@example.com',
            password: 'StrongPassword123!',
            name: 'New User',
        });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(res.body.accessToken).toBeDefined();
        (0, vitest_1.expect)(res.body.user.email).toBe('newuser@example.com');
        (0, vitest_1.expect)(res.headers['set-cookie']).toBeDefined();
    });
    (0, vitest_1.it)('should login an existing user', async () => {
        // Seed user
        const repo = data_source_1.AppDataSource.getRepository(User_entity_1.User);
        await repo.save(repo.create({
            email: 'loginuser@example.com',
            passwordHash: await bcryptjs_1.default.hash('StrongPassword123!', 10),
            name: 'Login User',
            provider: User_entity_1.AuthProvider.CREDENTIALS,
        }));
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/login').send({
            email: 'loginuser@example.com',
            password: 'StrongPassword123!',
        });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.accessToken).toBeDefined();
    });
    (0, vitest_1.describe)('Profile /me', () => {
        let accessToken = '';
        (0, vitest_1.beforeAll)(async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/register').send({
                email: 'profiletest@example.com',
                password: 'StrongPassword123!',
                name: 'Profile Test User',
            });
            accessToken = res.body.accessToken;
        });
        (0, vitest_1.it)('should get current user profile', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${accessToken}`);
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.user.email).toBe('profiletest@example.com');
            (0, vitest_1.expect)(res.body.user.name).toBe('Profile Test User');
        });
        (0, vitest_1.it)('should update current user profile', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/api/v1/auth/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                name: 'Updated Profile Name',
                bio: 'This is a new bio',
                picture: 'http://example.com/picture.jpg',
            });
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.user.name).toBe('Updated Profile Name');
            (0, vitest_1.expect)(res.body.user.bio).toBe('This is a new bio');
            (0, vitest_1.expect)(res.body.user.picture).toBe('http://example.com/picture.jpg');
        });
        (0, vitest_1.it)('should fail to update profile with invalid data', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/api/v1/auth/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                name: 'A', // too short, min length is 2
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
    });
    (0, vitest_1.describe)('Password Update /password', () => {
        let accessToken = '';
        (0, vitest_1.beforeAll)(async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/register').send({
                email: 'passwordtest@example.com',
                password: 'OldPassword123!',
                name: 'Password Test User',
            });
            accessToken = res.body.accessToken;
        });
        (0, vitest_1.it)('should fail to update password with incorrect current password', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/api/v1/auth/password')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                currentPassword: 'WrongPassword123!',
                newPassword: 'NewPassword123!',
            });
            (0, vitest_1.expect)(res.status).toBe(401);
            (0, vitest_1.expect)(res.body.error).toBe('Incorrect current password.');
        });
        (0, vitest_1.it)('should fail to update password with weak new password', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/api/v1/auth/password')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                currentPassword: 'OldPassword123!',
                newPassword: 'weak',
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.it)('should successfully update password', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/api/v1/auth/password')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                currentPassword: 'OldPassword123!',
                newPassword: 'NewPassword123!',
            });
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.message).toBe('Password updated successfully');
        });
        (0, vitest_1.it)('should fail to update password for Google OAuth users', async () => {
            // Seed Google user
            const repo = data_source_1.AppDataSource.getRepository(User_entity_1.User);
            const googleUser = await repo.save(repo.create({
                email: 'googletest@example.com',
                name: 'Google User',
                provider: User_entity_1.AuthProvider.GOOGLE,
                googleId: '123456789',
            }));
            // Generate access token for google user directly to test the endpoint
            // To simulate, we register and manually change provider in DB since we can't easily fake Google Auth endpoint
            const resRegister = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/register').send({
                email: 'oauthpass@example.com',
                password: 'Password123!',
                name: 'OAuth User',
            });
            const oauthAccessToken = resRegister.body.accessToken;
            // Make user a google user in DB
            const user = await repo.findOne({ where: { email: 'oauthpass@example.com' } });
            if (user) {
                user.provider = User_entity_1.AuthProvider.GOOGLE;
                await repo.save(user);
            }
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/api/v1/auth/password')
                .set('Authorization', `Bearer ${oauthAccessToken}`)
                .send({
                currentPassword: 'Password123!',
                newPassword: 'NewPassword123!',
            });
            (0, vitest_1.expect)(res.status).toBe(400);
            (0, vitest_1.expect)(res.body.error).toBe('Password updates are not applicable for Google OAuth accounts.');
        });
    });
});
