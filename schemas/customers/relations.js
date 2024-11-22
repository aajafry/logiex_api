import { relations } from "drizzle-orm/relations";
import { customers, sales } from "../index.js";

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(sales),
}));
