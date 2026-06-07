"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const RefreshToken_entity_1 = require("../entities/RefreshToken.entity");
const User_entity_1 = require("../entities/User.entity");
const data_source_1 = require("../utils/data-source");
const logger_1 = require("../utils/logger");
const BCRYPT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
// ─── Helpers ────────────────────────────────────────────────────────────────
function hashToken(token) {
    return crypto_1.default.createHash("sha256").update(token).digest("hex");
}
function generateAccessToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}
async function generateRefreshToken(userId, family) {
    const rawToken = (0, uuid_1.v4)() + "." + crypto_1.default.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    const tokenFamily = family || (0, uuid_1.v4)();
    const repo = data_source_1.AppDataSource.getRepository(RefreshToken_entity_1.RefreshToken);
    const entity = repo.create({
        tokenHash,
        userId,
        family: tokenFamily,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
        isRevoked: false,
    });
    await repo.save(entity);
    return { rawToken, entity };
}
async function revokeTokenFamily(family) {
    const repo = data_source_1.AppDataSource.getRepository(RefreshToken_entity_1.RefreshToken);
    await repo.update({ family }, { isRevoked: true });
    logger_1.logger.warn(`Revoked entire token family: ${family}`);
}
function toProfile(user) {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        picture: user.picture || null,
        bio: user.bio || null,
    };
}
// ─── Auth Service ───────────────────────────────────────────────────────────
exports.authService = {
    /**
     * Register a new user with email/password credentials.
     */
    async register(data) {
        const userRepo = data_source_1.AppDataSource.getRepository(User_entity_1.User);
        const existingUser = await userRepo.findOne({
            where: { email: data.email },
        });
        if (existingUser) {
            throw { status: 409, message: "A user with this email already exists." };
        }
        const passwordHash = await bcryptjs_1.default.hash(data.password, BCRYPT_ROUNDS);
        const user = userRepo.create({
            email: data.email,
            passwordHash,
            name: data.name,
            provider: User_entity_1.AuthProvider.CREDENTIALS,
        });
        await userRepo.save(user);
        const accessToken = generateAccessToken(user);
        const { rawToken: refreshToken } = await generateRefreshToken(user.id);
        logger_1.logger.info(`User registered: ${user.email}`);
        return {
            tokens: { accessToken, refreshToken },
            user: toProfile(user),
        };
    },
    /**
     * Authenticate with email/password credentials.
     */
    async login(email, password) {
        const userRepo = data_source_1.AppDataSource.getRepository(User_entity_1.User);
        const user = await userRepo.findOne({ where: { email } });
        if (!user || !user.passwordHash) {
            throw { status: 404, message: "This email is not registered in our system." };
        }
        if (!user.isActive) {
            throw { status: 403, message: "Account is deactivated." };
        }
        const isValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isValid) {
            throw { status: 401, message: "Incorrect password. Please try again." };
        }
        const accessToken = generateAccessToken(user);
        const { rawToken: refreshToken } = await generateRefreshToken(user.id);
        logger_1.logger.info(`User logged in: ${user.email}`);
        return {
            tokens: { accessToken, refreshToken },
            user: toProfile(user),
        };
    },
    /**
     * Cryptographic Token Rotation (CTR):
     * - Validates the incoming refresh token
     * - If the token was already revoked → reuse attack detected → revoke entire family
     * - If valid → revoke current, issue new pair linked via replacedByTokenId
     */
    async refreshTokens(rawRefreshToken) {
        const repo = data_source_1.AppDataSource.getRepository(RefreshToken_entity_1.RefreshToken);
        const userRepo = data_source_1.AppDataSource.getRepository(User_entity_1.User);
        const tokenHash = hashToken(rawRefreshToken);
        const storedToken = await repo.findOne({ where: { tokenHash } });
        if (!storedToken) {
            throw { status: 401, message: "Invalid refresh token." };
        }
        // Reuse detection: if token is already revoked, someone stole the old token
        if (storedToken.isRevoked) {
            await revokeTokenFamily(storedToken.family);
            throw {
                status: 401,
                message: "Refresh token reuse detected. All sessions revoked for security.",
            };
        }
        // Check expiry
        if (new Date() > storedToken.expiresAt) {
            storedToken.isRevoked = true;
            await repo.save(storedToken);
            throw { status: 401, message: "Refresh token expired." };
        }
        // Revoke current token
        storedToken.isRevoked = true;
        const user = await userRepo.findOne({ where: { id: storedToken.userId } });
        if (!user || !user.isActive) {
            await revokeTokenFamily(storedToken.family);
            throw { status: 401, message: "User account not found or deactivated." };
        }
        // Generate new pair in the same family
        const accessToken = generateAccessToken(user);
        const { rawToken: newRefreshToken, entity: newTokenEntity } = await generateRefreshToken(user.id, storedToken.family);
        // Link old → new for audit trail
        storedToken.replacedByTokenId = newTokenEntity.id;
        await repo.save(storedToken);
        logger_1.logger.info(`Token rotated for user: ${user.email}`);
        return { accessToken, refreshToken: newRefreshToken };
    },
    /**
     * Logout: Revoke the refresh token and its entire family.
     */
    async logout(rawRefreshToken) {
        const repo = data_source_1.AppDataSource.getRepository(RefreshToken_entity_1.RefreshToken);
        const tokenHash = hashToken(rawRefreshToken);
        const storedToken = await repo.findOne({ where: { tokenHash } });
        if (storedToken) {
            await revokeTokenFamily(storedToken.family);
        }
        logger_1.logger.info("User logged out, token family revoked");
    },
    /**
     * Sync Google OAuth user into the local user table.
     * Find-or-create by googleId, or link to existing email if it matches.
     */
    async syncGoogleUser(profile) {
        const userRepo = data_source_1.AppDataSource.getRepository(User_entity_1.User);
        // Try to find by googleId first
        let user = await userRepo.findOne({
            where: { googleId: profile.googleId },
        });
        if (!user) {
            // Try to find by email (link accounts)
            user = await userRepo.findOne({ where: { email: profile.email } });
            if (user) {
                user.googleId = profile.googleId;
                user.provider = User_entity_1.AuthProvider.GOOGLE;
                await userRepo.save(user);
            }
            else {
                // Create new user
                user = userRepo.create({
                    email: profile.email,
                    name: profile.name,
                    googleId: profile.googleId,
                    provider: User_entity_1.AuthProvider.GOOGLE,
                    passwordHash: null,
                });
                await userRepo.save(user);
            }
        }
        if (!user.isActive) {
            throw { status: 403, message: "Account is deactivated." };
        }
        const accessToken = generateAccessToken(user);
        const { rawToken: refreshToken } = await generateRefreshToken(user.id);
        logger_1.logger.info(`Google user synced: ${user.email}`);
        return {
            tokens: { accessToken, refreshToken },
            user: toProfile(user),
        };
    },
    /**
     * Get user profile by ID.
     */
    async getProfile(userId) {
        const userRepo = data_source_1.AppDataSource.getRepository(User_entity_1.User);
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw { status: 404, message: "User not found." };
        }
        return toProfile(user);
    },
    /**
     * Update user profile name, picture, and/or bio.
     */
    async updateProfile(userId, data) {
        const userRepo = data_source_1.AppDataSource.getRepository(User_entity_1.User);
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw { status: 404, message: "User not found." };
        }
        if (data.name !== undefined)
            user.name = data.name;
        if (data.picture !== undefined)
            user.picture = data.picture;
        if (data.bio !== undefined)
            user.bio = data.bio;
        await userRepo.save(user);
        return toProfile(user);
    },
    /**
     * Update user password. Checks if user is a Google OAuth user and blocks it.
     * Compares current password, then hashes and saves the new password.
     */
    async updatePassword(userId, currentPasswordRaw, newPasswordRaw) {
        const userRepo = data_source_1.AppDataSource.getRepository(User_entity_1.User);
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw { status: 404, message: "User not found." };
        }
        if (user.provider === User_entity_1.AuthProvider.GOOGLE || !user.passwordHash) {
            throw { status: 400, message: "Password updates are not applicable for Google OAuth accounts." };
        }
        const isValid = await bcryptjs_1.default.compare(currentPasswordRaw, user.passwordHash);
        if (!isValid) {
            throw { status: 401, message: "Incorrect current password." };
        }
        const saltRounds = 12;
        user.passwordHash = await bcryptjs_1.default.hash(newPasswordRaw, saltRounds);
        await userRepo.save(user);
        logger_1.logger.info(`Password updated for user: ${user.email}`);
    },
};
