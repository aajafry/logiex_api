import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { vendors } from "../schemas/index.js";

export const findVendorByPhone = async (phone) => {
  const [vendor] = await db
    .select()
    .from(vendors)
    .where(ilike(vendors.phone, phone))
    .limit(1);

  return vendor ? vendor : null;
};
