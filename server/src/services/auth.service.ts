import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { RefreshToken } from "../entities/RefreshToken.entity";
import { AuthProvider, User } from "../entities/User.entity";
import { AppDataSource } from "../utils/data-source";
import { logger } from "../utils/logger";

const BCRYPT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  provider: AuthProvider;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateAccessToken(user: { id: string; email: string }): string {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: ACCESS_TOKEN_EXPIRY },
  );
}

async function generateRefreshToken(
  userId: string,
  family?: string,
): Promise<{ rawToken: string; entity: RefreshToken }> {
  const rawToken = uuidv4() + "." + crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const tokenFamily = family || uuidv4();

  const repo = AppDataSource.getRepository(RefreshToken);
  const entity = repo.create({
    tokenHash,
    userId,
    family: tokenFamily,
    expiresAt: new Date(
      Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    ),
    isRevoked: false,
  });
  await repo.save(entity);

  return { rawToken, entity };
}

async function revokeTokenFamily(family: string): Promise<void> {
  const repo = AppDataSource.getRepository(RefreshToken);
  await repo.update({ family }, { isRevoked: true });
  logger.warn(`Revoked entire token family: ${family}`);
}

function toProfile(user: User): UserProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    provider: user.provider,
  };
}

// ─── Auth Service ───────────────────────────────────────────────────────────

export const authService = {
  /**
   * Register a new user with email/password credentials.
   */
  async register(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<{ tokens: TokenPair; user: UserProfile }> {
    const userRepo = AppDataSource.getRepository(User);

    const existingUser = await userRepo.findOne({
      where: { email: data.email },
    });
    if (existingUser) {
      throw { status: 409, message: "A user with this email already exists." };
    }

    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    const user = userRepo.create({
      email: data.email,
      passwordHash,
      name: data.name,
      provider: AuthProvider.CREDENTIALS,
    });
    await userRepo.save(user);

    const accessToken = generateAccessToken(user);
    const { rawToken: refreshToken } = await generateRefreshToken(user.id);

    logger.info(`User registered: ${user.email}`);
    return {
      tokens: { accessToken, refreshToken },
      user: toProfile(user),
    };
  },

  /**
   * Authenticate with email/password credentials.
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ tokens: TokenPair; user: UserProfile }> {
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({ where: { email } });
    if (!user || !user.passwordHash) {
      throw { status: 404, message: "This email is not registered in our system." };
    }

    if (!user.isActive) {
      throw { status: 403, message: "Account is deactivated." };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw { status: 401, message: "Incorrect password. Please try again." };
    }

    const accessToken = generateAccessToken(user);
    const { rawToken: refreshToken } = await generateRefreshToken(user.id);

    logger.info(`User logged in: ${user.email}`);
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
  async refreshTokens(rawRefreshToken: string): Promise<TokenPair> {
    const repo = AppDataSource.getRepository(RefreshToken);
    const userRepo = AppDataSource.getRepository(User);

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
        message:
          "Refresh token reuse detected. All sessions revoked for security.",
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
    const { rawToken: newRefreshToken, entity: newTokenEntity } =
      await generateRefreshToken(user.id, storedToken.family);

    // Link old → new for audit trail
    storedToken.replacedByTokenId = newTokenEntity.id;
    await repo.save(storedToken);

    logger.info(`Token rotated for user: ${user.email}`);
    return { accessToken, refreshToken: newRefreshToken };
  },

  /**
   * Logout: Revoke the refresh token and its entire family.
   */
  async logout(rawRefreshToken: string): Promise<void> {
    const repo = AppDataSource.getRepository(RefreshToken);
    const tokenHash = hashToken(rawRefreshToken);
    const storedToken = await repo.findOne({ where: { tokenHash } });

    if (storedToken) {
      await revokeTokenFamily(storedToken.family);
    }
    logger.info("User logged out, token family revoked");
  },

  /**
   * Sync Google OAuth user into the local user table.
   * Find-or-create by googleId, or link to existing email if it matches.
   */
  async syncGoogleUser(profile: {
    googleId: string;
    email: string;
    name: string;
  }): Promise<{ tokens: TokenPair; user: UserProfile }> {
    const userRepo = AppDataSource.getRepository(User);

    // Try to find by googleId first
    let user = await userRepo.findOne({
      where: { googleId: profile.googleId },
    });

    if (!user) {
      // Try to find by email (link accounts)
      user = await userRepo.findOne({ where: { email: profile.email } });
      if (user) {
        user.googleId = profile.googleId;
        user.provider = AuthProvider.GOOGLE;
        await userRepo.save(user);
      } else {
        // Create new user
        user = userRepo.create({
          email: profile.email,
          name: profile.name,
          googleId: profile.googleId,
          provider: AuthProvider.GOOGLE,
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

    logger.info(`Google user synced: ${user.email}`);
    return {
      tokens: { accessToken, refreshToken },
      user: toProfile(user),
    };
  },

  /**
   * Get user profile by ID.
   */
  async getProfile(userId: string): Promise<UserProfile> {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw { status: 404, message: "User not found." };
    }
    return toProfile(user);
  },
};
