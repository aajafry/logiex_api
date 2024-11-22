import { relations } from "drizzle-orm/relations";
import {
  inventories,
  products,
  purchases,
  sales,
  saleProducts,
} from "../index.js";

export const saleProductsRelations = relations(saleProducts, ({ one }) => ({
  sale: one(sales, {
    fields: [saleProducts.bill_id],
    references: [sales.bill_id],
  }),
  product: one(products, {
    fields: [saleProducts.product],
    references: [products.name],
  }),
  purchase: one(purchases, {
    fields: [saleProducts.mr_id],
    references: [purchases.mr_id],
  }),
  inventory: one(inventories, {
    fields: [saleProducts.inventory],
    references: [inventories.name],
  }),
}));
