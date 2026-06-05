"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idempotency = void 0;
const data_source_1 = require("../utils/data-source");
const IdempotencyRecord_entity_1 = require("../entities/IdempotencyRecord.entity");
const MUTATING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];
const IDEMPOTENCY_TTL_HOURS = 24;
/**
 * Idempotency middleware for mutating endpoints.
 * Requires `X-Idempotency-Key` header on POST/PUT/PATCH/DELETE.
 *
 * Behavior:
 * 1. Missing key on mutating method → 400
 * 2. Key found in DB (not expired) → return cached response
 * 3. Key not found → proceed, then cache the response
 */
const idempotency = async (req, res, next) => {
    // Only enforce on mutating methods
    if (!MUTATING_METHODS.includes(req.method.toUpperCase())) {
        next();
        return;
    }
    const idempotencyKey = req.headers['x-idempotency-key'];
    if (!idempotencyKey) {
        res.status(400).json({
            error: 'Missing X-Idempotency-Key',
            message: 'All mutating requests must include an X-Idempotency-Key header.',
        });
        return;
    }
    const userId = req.user?.id;
    if (!userId) {
        // Idempotency requires auth — skip if unauthenticated (auth middleware will catch)
        next();
        return;
    }
    const repo = data_source_1.AppDataSource.getRepository(IdempotencyRecord_entity_1.IdempotencyRecord);
    try {
        // Check for existing record
        const existing = await repo.findOne({
            where: { idempotencyKey, userId },
        });
        if (existing) {
            // Check if expired
            if (new Date() > existing.expiresAt) {
                // Expired — remove stale record and proceed
                await repo.remove(existing);
            }
            else {
                // Return cached response
                res.status(existing.statusCode).json(existing.responseBody);
                return;
            }
        }
        // Intercept the response to cache it
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            // Store the response asynchronously (fire-and-forget)
            const record = repo.create({
                idempotencyKey,
                userId,
                method: req.method,
                path: req.originalUrl,
                statusCode: res.statusCode,
                responseBody: body,
                expiresAt: new Date(Date.now() + IDEMPOTENCY_TTL_HOURS * 60 * 60 * 1000),
            });
            repo.save(record).catch(() => {
                // Silently fail — idempotency is best-effort
            });
            return originalJson(body);
        };
        next();
    }
    catch {
        // On DB errors, proceed without idempotency (graceful degradation)
        next();
    }
};
exports.idempotency = idempotency;
