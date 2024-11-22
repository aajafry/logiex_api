import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connection = postgres(process.env.DATABASE_URL, { max: 1 });

async function main() {
  await migrate(drizzle(connection), {
    migrationsFolder: "./migrations",
  });
}

main()
  .catch((error) => console.error("error while migration occurs:", error))
  .finally(() => connection.end());
