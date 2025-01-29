import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { inventories } from "../schemas/index";

export const findInventoryByPhone = async (phone: string) => {
  const [inventory] = await db
    .select()
    .from(inventories)
    .where(ilike(inventories.phone, phone))
    .limit(1);

  return inventory ? inventory : null;
};
