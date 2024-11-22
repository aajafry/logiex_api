import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { inventories } from "../schemas/index.js";

export const findInventoryByPhone = async (phone) => {
  const [inventory] = await db
    .select()
    .from(inventories)
    .where(ilike(inventories.phone, phone))
    .limit(1);

  return inventory ? inventory : null;
};
