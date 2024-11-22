import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { customers } from "../schemas/index.js";

export const findCustomerByPhone = async (phone) => {
  const [customer] = await db
    .select()
    .from(customers)
    .where(ilike(customers.phone, phone))
    .limit(1);

  return customer ? customer : null;
};
