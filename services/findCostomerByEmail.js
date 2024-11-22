import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { customers } from "../schemas/index.js";

export const findCustomerByEmail = async (email) => {
  const [customer] = await db
    .select()
    .from(customers)
    .where(ilike(customers.email, email))
    .limit(1);

  return customer ? customer : null;
};
