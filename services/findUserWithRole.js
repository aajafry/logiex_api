import { and, eq, inArray } from "drizzle-orm";
import { db } from "../database/connection.js";
import { users } from "../schemas/index.js";

export const findUserWithRole = async (email, allowedRoles) => {
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), inArray(users.role, allowedRoles)))
    .limit(1);

  return user ? user : null;
};
