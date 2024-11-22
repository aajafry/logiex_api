import { and, eq, ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { inventoryEmployments } from "../schemas/index.js";

export const activeEmpTracker = async (inventory) => {
  const [activeEmployee] = await db
    .select()
    .from(inventoryEmployments)
    .where(
      and(
        ilike(inventoryEmployments.inventory, inventory),
        eq(inventoryEmployments.employee_status, true)
      )
    )
    .limit(1);

  return activeEmployee ? activeEmployee : null;
};
