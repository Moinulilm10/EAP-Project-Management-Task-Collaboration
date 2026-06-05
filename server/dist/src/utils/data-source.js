"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const User_entity_1 = require("../entities/User.entity");
const RefreshToken_entity_1 = require("../entities/RefreshToken.entity");
const IdempotencyRecord_entity_1 = require("../entities/IdempotencyRecord.entity");
const Project_entity_1 = require("../entities/Project.entity");
const Task_entity_1 = require("../entities/Task.entity");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('neon') || process.env.DATABASE_URL?.includes('render')
        ? { rejectUnauthorized: false }
        : false,
    extra: {
        max: 10,
        connectionTimeoutMillis: 30000,
    },
    synchronize: true,
    logging: false,
    entities: [User_entity_1.User, RefreshToken_entity_1.RefreshToken, IdempotencyRecord_entity_1.IdempotencyRecord, Project_entity_1.Project, Task_entity_1.Task],
    migrations: [],
    subscribers: [],
});
