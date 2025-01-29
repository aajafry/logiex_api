import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { inventories } from "../schemas/index";

export const findInventoryByName = async (name: string) => {
  const [inventory] = await db
    .select()
    .from(inventories)
    .where(ilike(inventories.name, name))
    .limit(1);

  return inventory ? inventory : null;
};
