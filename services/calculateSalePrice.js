import { ilike } from "drizzle-orm";
import { db } from "../database/connection.js";
import { saleProducts } from "../schemas/index.js";

export const calculateSalePrice = async (billId, ctx = db) => {
  const products = await ctx
    .select()
    .from(saleProducts)
    .where(ilike(saleProducts.bill_id, billId));

  return products.reduce(
    (total, product) => total + parseFloat(product.total_price),
    0
  );
};
