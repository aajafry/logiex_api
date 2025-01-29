import { neonDrizzle } from "drizzle-orm/neon-serverless";

declare global {
  var _db: ReturnType<typeof neonDrizzle> | undefined;
}

export {};
