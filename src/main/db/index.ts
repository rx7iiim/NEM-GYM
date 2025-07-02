// src/main/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const client = postgres(process.env.DATABASE_URL, { max: 1 }); // limit connections for dev
export const db = drizzle(client, { schema });

// ✅ Test connection
(async () => {
  try {
     await client`SELECT 1`;
    console.log('✅ Connected to PostgreSQL database');
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL:', err);
  }
})();


