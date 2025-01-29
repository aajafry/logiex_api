import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { users } from "../schemas/index";

export const findUserByPhone = async (phone: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(ilike(users.phone, phone))
    .limit(1);

  return user ? user : null;
};
