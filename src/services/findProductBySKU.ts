import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { products } from "../schemas/index";

export const findProductBySKU = async (sku: string) => {
  const [product] = await db
    .select()
    .from(products)
    .where(ilike(products.sku, sku))
    .limit(1);

  return product ? product : null;
};
