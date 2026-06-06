"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const IdempotencyRecord_entity_1 = require("../entities/IdempotencyRecord.entity");
const Project_entity_1 = require("../entities/Project.entity");
const ProjectMember_entity_1 = require("../entities/ProjectMember.entity");
const RefreshToken_entity_1 = require("../entities/RefreshToken.entity");
const Task_entity_1 = require("../entities/Task.entity");
const User_entity_1 = require("../entities/User.entity");
const Role_entity_1 = require("../entities/Role.entity");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("neon") ||
        process.env.DATABASE_URL?.includes("render")
        ? { rejectUnauthorized: false }
        : false,
    extra: {
        max: 10,
        connectionTimeoutMillis: 30000,
    },
    synchronize: true,
    schema: process.env.NODE_ENV === 'test' ? 'test' : 'public',
    logging: false,
    entities: [
        User_entity_1.User,
        RefreshToken_entity_1.RefreshToken,
        IdempotencyRecord_entity_1.IdempotencyRecord,
        Project_entity_1.Project,
        ProjectMember_entity_1.ProjectMember,
        Task_entity_1.Task,
        Role_entity_1.Role,
    ],
    migrations: [],
    subscribers: [],
});
