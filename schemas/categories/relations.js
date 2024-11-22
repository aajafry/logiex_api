import { relations } from "drizzle-orm/relations";
import { categories, products } from "../index.js";

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));
