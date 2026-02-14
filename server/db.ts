import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Ensure sslmode=verify-full to avoid pg deprecation warning
const dbUrl = process.env.DATABASE_URL.replace(/sslmode=(require|prefer|verify-ca)\b/, 'sslmode=verify-full');

export const pool = new Pool({ connectionString: dbUrl });
export const db = drizzle({ client: pool, schema });