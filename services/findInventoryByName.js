import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { inventories } from "../schemas/index.js";

export const findInventoryByName = async (name) => {
  const [inventory] = await db
    .select()
    .from(inventories)
    .where(ilike(inventories.name, name))
    .limit(1);

  return inventory ? inventory : null;
};
