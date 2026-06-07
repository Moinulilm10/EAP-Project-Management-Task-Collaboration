"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const data_source_1 = require("../../utils/data-source");
const test_setup_1 = require("../../utils/test-setup");
(0, vitest_1.describe)('Profile Integration Tests', () => {
    let userToken;
    const userEmail = 'profiletest@example.com';
    const userName = 'Profile Test User';
    (0, vitest_1.beforeAll)(async () => {
        await (0, test_setup_1.ensureTestSchema)();
        if (!data_source_1.AppDataSource.isInitialized) {
            await data_source_1.AppDataSource.initialize();
        }
        await data_source_1.AppDataSource.synchronize(true);
        // Register a test user
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/register').send({
            email: userEmail,
            password: 'StrongPassword123!',
            name: userName,
        });
        userToken = res.body.accessToken;
    }, 30000);
    (0, vitest_1.afterAll)(async () => {
        if (data_source_1.AppDataSource.isInitialized) {
            await data_source_1.AppDataSource.destroy();
        }
    });
    (0, vitest_1.describe)('GET /api/v1/auth/me', () => {
        (0, vitest_1.it)('should successfully fetch the current user profile', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.user).toBeDefined();
            (0, vitest_1.expect)(res.body.user.email).toBe(userEmail);
            (0, vitest_1.expect)(res.body.user.name).toBe(userName);
            (0, vitest_1.expect)(res.body.user.bio).toBeNull();
            (0, vitest_1.expect)(res.body.user.picture).toBeNull();
        });
        (0, vitest_1.it)('should return 401 when authorization header is missing', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get('/api/v1/auth/me');
            (0, vitest_1.expect)(res.status).toBe(401);
            (0, vitest_1.expect)(res.body.error).toBe('Access denied. No token provided.');
        });
        (0, vitest_1.it)('should return 401 when token is invalid', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/api/v1/auth/me')
                .set('Authorization', 'Bearer invalidtokenhere');
            (0, vitest_1.expect)(res.status).toBe(401);
            (0, vitest_1.expect)(res.body.error).toBe('Invalid or expired access token.');
        });
    });
    (0, vitest_1.describe)('PUT /api/v1/auth/me', () => {
        (0, vitest_1.it)('should successfully update user name, picture, and bio', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/api/v1/auth/me')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                name: 'Jane Doe',
                picture: 'https://supabase-avatar-url.com/123.jpg',
                bio: 'Software engineer from the future',
            });
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.user.name).toBe('Jane Doe');
            (0, vitest_1.expect)(res.body.user.picture).toBe('https://supabase-avatar-url.com/123.jpg');
            (0, vitest_1.expect)(res.body.user.bio).toBe('Software engineer from the future');
            // Verify DB persists it by making a GET request
            const getRes = await (0, supertest_1.default)(app_1.default)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(getRes.body.user.name).toBe('Jane Doe');
            (0, vitest_1.expect)(getRes.body.user.bio).toBe('Software engineer from the future');
        });
        (0, vitest_1.it)('should sanitize HTML inputs (XSS prevention) in name and bio', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/api/v1/auth/me')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                name: '<script>alert("hacked")</script>Secure Name',
                bio: '<b>Bold Bio</b> with <script>console.log("XSS")</script> clean text',
            });
            (0, vitest_1.expect)(res.status).toBe(200);
            // The schema sanitization strips out html tags & script blocks
            (0, vitest_1.expect)(res.body.user.name).toBe('Secure Name');
            (0, vitest_1.expect)(res.body.user.bio).toBe('Bold Bio with  clean text');
        });
        (0, vitest_1.it)('should return 400 when name is less than 2 characters after sanitization', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/api/v1/auth/me')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                name: '   a   ', // length 1 after trim
            });
            (0, vitest_1.expect)(res.status).toBe(400);
            (0, vitest_1.expect)(res.body.error).toBe('Validation failed');
            (0, vitest_1.expect)(res.body.details[0].field).toBe('name');
        });
        (0, vitest_1.it)('should return 400 when name is longer than 100 characters', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/api/v1/auth/me')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                name: 'a'.repeat(101),
            });
            (0, vitest_1.expect)(res.status).toBe(400);
            (0, vitest_1.expect)(res.body.error).toBe('Validation failed');
            (0, vitest_1.expect)(res.body.details[0].field).toBe('name');
        });
        (0, vitest_1.it)('should return 400 when bio is longer than 1000 characters', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/api/v1/auth/me')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                bio: 'a'.repeat(1001),
            });
            (0, vitest_1.expect)(res.status).toBe(400);
            (0, vitest_1.expect)(res.body.error).toBe('Validation failed');
            (0, vitest_1.expect)(res.body.details[0].field).toBe('bio');
        });
        (0, vitest_1.it)('should return 400 when picture is longer than 1000 characters', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/api/v1/auth/me')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                picture: 'a'.repeat(1001),
            });
            (0, vitest_1.expect)(res.status).toBe(400);
            (0, vitest_1.expect)(res.body.error).toBe('Validation failed');
            (0, vitest_1.expect)(res.body.details[0].field).toBe('picture');
        });
        (0, vitest_1.it)('should allow omitting optional fields', async () => {
            // Send only name
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/api/v1/auth/me')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                name: 'Only Name Update',
            });
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.user.name).toBe('Only Name Update');
            // Picture and bio should remain their previous values
            (0, vitest_1.expect)(res.body.user.bio).toBe('Bold Bio with  clean text');
        });
        (0, vitest_1.it)('should allow setting bio to null or empty string', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/api/v1/auth/me')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                bio: null,
            });
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.user.bio).toBeNull();
        });
        (0, vitest_1.it)('should return 401 when updating profile without a token', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/api/v1/auth/me')
                .send({
                name: 'Unauthenticated Update',
            });
            (0, vitest_1.expect)(res.status).toBe(401);
        });
    });
});
