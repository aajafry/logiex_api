import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { products } from "../schemas/index";

export const findProductByName = async (name: string) => {
  const [product] = await db
    .select()
    .from(products)
    .where(ilike(products.name, name))
    .limit(1);

  return product ? product : null;
};
