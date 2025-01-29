import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  schema: isProduction ? "./dist/schemas/index.js" : "./src/schemas/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    ssl: true,
  },
  breakpoints: true,
  verbose: true,
  strict: true,
});
