import "dotenv/config";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-serverless";
import { drizzle as postgresDrizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import ws from "ws";
import * as schema from "../schemas/index.js";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("No database connection string found.");
}

function getDrizzleClient() {
  if (process.env.NODE_ENV === "production") {
    const connection = postgres(connectionString, { ssl: true });
    return postgresDrizzle(connection, { schema, logger: true });
  } else if (process.env.NODE_ENV === "development") {
    if (!global._db) {
      const connection = new Pool({ connectionString });
      global._db = neonDrizzle(connection, { schema, logger: false });
    }
    return global._db;
  } else {
    throw new Error("NODE_ENV must be either 'production' or 'development'.");
  }
}

export const db = getDrizzleClient();
