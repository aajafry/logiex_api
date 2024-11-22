import { and, eq, ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { users } from "../schemas/index.js";

export const findUserByIdAndRole = async (id, role) => {
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, id), eq(users.role, role)))
    .limit(1);

  return user ? user : null;
};
