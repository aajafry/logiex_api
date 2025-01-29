import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { customers } from "../schemas/index";

export const findCustomerByEmail = async (email: string) => {
  const [customer] = await db
    .select()
    .from(customers)
    .where(ilike(customers.email, email))
    .limit(1);

  return customer ? customer : null;
};
