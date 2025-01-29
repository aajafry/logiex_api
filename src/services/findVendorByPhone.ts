import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { vendors } from "../schemas/index";

export const findVendorByPhone = async (phone: string) => {
  const [vendor] = await db
    .select()
    .from(vendors)
    .where(ilike(vendors.phone, phone))
    .limit(1);

  return vendor ? vendor : null;
};
