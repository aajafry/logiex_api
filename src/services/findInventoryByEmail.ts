import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { inventories } from "../schemas/index";

export const findInventoryByEmail = async (email: string) => {
  const [inventory] = await db
    .select()
    .from(inventories)
    .where(ilike(inventories.email, email))
    .limit(1);

  return inventory ? inventory : null;
};
