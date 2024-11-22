import "dotenv/config";
// import postgres from "postgres";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../schemas/index.js";

const connection = neon(process.env.DATABASE_URL);
// const connection = postgres(process.env.DATABASE_URL);

export const db = drizzle(connection, { schema, logger: true });
