import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { purchaseProducts } from "../schemas/index";

export const calculatePurchasePrice = async (mrId: string, ctx = db) => {
  const products = await ctx
    .select()
    .from(purchaseProducts)
    .where(ilike(purchaseProducts.mr_id, mrId));

  return products.reduce(
    (total: number, product: { total_price: number }) =>
      total + Number(product.total_price),
    0
  );
};
