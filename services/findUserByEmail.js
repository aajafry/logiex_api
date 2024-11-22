import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { users } from "../schemas/index.js";

export const findUserByEmail = async (email) => {
  const [user] = await db
    .select()
    .from(users)
    .where(ilike(users.email, email))
    .limit(1);

  return user ? user : null;
};
