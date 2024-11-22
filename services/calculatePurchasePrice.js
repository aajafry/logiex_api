import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { purchaseProducts } from "../schemas/index.js";

export const calculatePurchasePrice = async (mrId, ctx = db) => {
  const products = await ctx
    .select()
    .from(purchaseProducts)
    .where(ilike(purchaseProducts.mr_id, mrId));

  return products.reduce(
    (total, product) => total + parseFloat(product.total_price),
    0
  );
};
