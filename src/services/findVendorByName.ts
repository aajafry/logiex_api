import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { vendors } from "../schemas/index";

export const findVendorByName = async (name: string) => {
  const [vendor] = await db
    .select()
    .from(vendors)
    .where(ilike(vendors.name, name))
    .limit(1);

  return vendor ? vendor : null;
};
