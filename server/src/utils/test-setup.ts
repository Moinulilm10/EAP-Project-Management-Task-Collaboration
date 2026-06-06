import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export async function ensureTestSchema(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in environment variables.");
  }

  const client = new Client({
    connectionString,
    ssl: connectionString.includes("neon") || connectionString.includes("render")
      ? { rejectUnauthorized: false }
      : false,
  });

  try {
    await client.connect();
    await client.query('CREATE SCHEMA IF NOT EXISTS test;');
  } catch (error) {
    console.error("Failed to ensure test schema exists:", error);
    throw error;
  } finally {
    await client.end();
  }
}
