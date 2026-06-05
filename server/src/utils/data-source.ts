import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/User.entity';
import { RefreshToken } from '../entities/RefreshToken.entity';
import { IdempotencyRecord } from '../entities/IdempotencyRecord.entity';
import { Project } from '../entities/Project.entity';
import { Task } from '../entities/Task.entity';

dotenv.config();

export const AppDataSource = new DataSource({
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
    entities: [User, RefreshToken, IdempotencyRecord, Project, Task],
    migrations: [],
    subscribers: [],
});