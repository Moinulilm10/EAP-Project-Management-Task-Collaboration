"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureTestSchema = ensureTestSchema;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function ensureTestSchema() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not defined in environment variables.");
    }
    const client = new pg_1.Client({
        connectionString,
        ssl: connectionString.includes("neon") || connectionString.includes("render")
            ? { rejectUnauthorized: false }
            : false,
    });
    try {
        await client.connect();
        await client.query('CREATE SCHEMA IF NOT EXISTS test;');
    }
    catch (error) {
        console.error("Failed to ensure test schema exists:", error);
        throw error;
    }
    finally {
        await client.end();
    }
}
