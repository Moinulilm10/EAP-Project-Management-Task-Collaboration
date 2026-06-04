import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    extra: {
        max: 10,
        connectionTimeoutMillis: 30000,
    },
    synchronize: true,
    logging: false,
    entities: [__dirname + '/entities/**/*.ts'],
    migrations: [],
    subscribers: [],
});