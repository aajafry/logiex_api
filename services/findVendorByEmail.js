import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { vendors } from "../schemas/index.js";

export const findVendorByEmail = async (email) => {
  const [vendor] = await db
    .select()
    .from(vendors)
    .where(ilike(vendors.email, email))
    .limit(1);

  return vendor ? vendor : null;
};
