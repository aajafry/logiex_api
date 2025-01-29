import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { users } from "../schemas/index";

export const findUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(ilike(users.email, email))
    .limit(1);

  return user ? user : null;
};
