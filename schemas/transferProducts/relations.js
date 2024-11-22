import { relations } from "drizzle-orm/relations";
import { products, transfers, purchases, transferProducts } from "../index.js";

export const transferProductsRelations = relations(
  transferProducts,
  ({ one }) => ({
    product: one(products, {
      fields: [transferProducts.product],
      references: [products.name],
    }),
    transfer: one(transfers, {
      fields: [transferProducts.trf_id],
      references: [transfers.trf_id],
    }),
    purchase: one(purchases, {
      fields: [transferProducts.mr_id],
      references: [purchases.mr_id],
    }),
  })
);
