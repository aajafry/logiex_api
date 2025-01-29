import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { vendors } from "../schemas/index";

export const findVendorByEmail = async (email: string) => {
  const [vendor] = await db
    .select()
    .from(vendors)
    .where(ilike(vendors.email, email))
    .limit(1);

  return vendor ? vendor : null;
};
