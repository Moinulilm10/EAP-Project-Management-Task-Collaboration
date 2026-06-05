import dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { IdempotencyRecord } from "../entities/IdempotencyRecord.entity";
import { Project } from "../entities/Project.entity";
import { ProjectMember } from "../entities/ProjectMember.entity";
import { RefreshToken } from "../entities/RefreshToken.entity";
import { Task } from "../entities/Task.entity";
import { User } from "../entities/User.entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_URL?.includes("neon") ||
    process.env.DATABASE_URL?.includes("render")
      ? { rejectUnauthorized: false }
      : false,
  extra: {
    max: 10,
    connectionTimeoutMillis: 30000,
  },
  synchronize: true,
  logging: false,
  entities: [
    User,
    RefreshToken,
    IdempotencyRecord,
    Project,
    ProjectMember,
    Task,
  ],
  migrations: [],
  subscribers: [],
});
