import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { products } from "../schemas/index.js";

export const findProductBySKU = async (sku) => {
  const [product] = await db
    .select()
    .from(products)
    .where(ilike(products.sku, sku))
    .limit(1);

  return product ? product : null;
};
