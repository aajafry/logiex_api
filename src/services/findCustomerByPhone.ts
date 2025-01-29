import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { customers } from "../schemas/index";

export const findCustomerByPhone = async (phone: string) => {
  const [customer] = await db
    .select()
    .from(customers)
    .where(ilike(customers.phone, phone))
    .limit(1);

  return customer ? customer : null;
};
