import { and, eq, ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { inventoryEmployments } from "../schemas/index";

export const activeEmpTracker = async (inventory: string) => {
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
