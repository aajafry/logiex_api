import { ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { saleProducts } from "../schemas/index";

export const calculateSalePrice = async (billId: string, ctx = db) => {
  const products = await ctx
    .select()
    .from(saleProducts)
    .where(ilike(saleProducts.bill_id, billId));

  return products.reduce(
    (total: number, product: { total_price: number }) =>
      total + product.total_price,
    0
  );
};
