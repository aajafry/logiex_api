import { eq, ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { customers } from "../schemas/index.js";

export const findCustomerById = async (customerId) => {
  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, customerId))
    .limit(1);

  return customer ? customer : null;
};
