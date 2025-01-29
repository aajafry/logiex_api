import { and, eq, ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { users } from "../schemas/index";

export const findUserByIdAndRole = async (id: string, role: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, id), eq(users.role, role)))
    .limit(1);

  return user ? user : null;
};
