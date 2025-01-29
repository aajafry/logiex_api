import { eq, ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { customers } from "../schemas/index";

export const findCustomerById = async (customerId: string) => {
  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, customerId))
    .limit(1);

  return customer ? customer : null;
};
