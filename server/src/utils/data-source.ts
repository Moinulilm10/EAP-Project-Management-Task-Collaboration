import dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { IdempotencyRecord } from "../entities/IdempotencyRecord.entity";
import { Project } from "../entities/Project.entity";
import { ProjectMember } from "../entities/ProjectMember.entity";
import { RefreshToken } from "../entities/RefreshToken.entity";
import { Task } from "../entities/Task.entity";
import { User } from "../entities/User.entity";
import { Role } from "../entities/Role.entity";
import { Team } from "../entities/Team.entity";
import { TeamMember } from "../entities/TeamMember.entity";
import { ProjectTeam } from "../entities/ProjectTeam.entity";
import { TaskTeam } from "../entities/TaskTeam.entity";

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
  schema: process.env.NODE_ENV === 'test' ? 'test' : 'public',
  logging: false,
  entities: [
    User,
    RefreshToken,
    IdempotencyRecord,
    Project,
    ProjectMember,
    Task,
    Role,
    Team,
    TeamMember,
    ProjectTeam,
    TaskTeam,
  ],
  migrations: [],
  subscribers: [],
});

