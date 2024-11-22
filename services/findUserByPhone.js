import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { users } from "../schemas/index.js";

export const findUserByPhone = async (phone) => {
  const [user] = await db
    .select()
    .from(users)
    .where(ilike(users.phone, phone))
    .limit(1);

  return user ? user : null;
};
