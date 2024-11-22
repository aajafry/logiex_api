import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { products } from "../schemas/index.js";

export const findProductByName = async (name) => {
  const [product] = await db
    .select()
    .from(products)
    .where(ilike(products.name, name))
    .limit(1);

  return product ? product : null;
};
