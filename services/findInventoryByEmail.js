import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { inventories } from "../schemas/index.js";

export const findInventoryByEmail = async (email) => {
  const [inventory] = await db
    .select()
    .from(inventories)
    .where(ilike(inventories.email, email))
    .limit(1);

  return inventory ? inventory : null;
};
