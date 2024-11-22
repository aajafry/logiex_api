import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { vendors } from "../schemas/index.js";

export const findVendorByName = async (name) => {
  const [vendor] = await db
    .select()
    .from(vendors)
    .where(ilike(vendors.name, name))
    .limit(1);

  return vendor ? vendor : null;
};
