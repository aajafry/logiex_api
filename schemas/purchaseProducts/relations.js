import { relations } from "drizzle-orm/relations";
import { purchases, purchaseProducts, products } from "../index.js";

export const purchaseProductsRelations = relations(
  purchaseProducts,
  ({ one }) => ({
    purchase: one(purchases, {
      fields: [purchaseProducts.mr_id],
      references: [purchases.mr_id],
    }),
    product: one(products, {
      fields: [purchaseProducts.product],
      references: [products.name],
    }),
  })
);
