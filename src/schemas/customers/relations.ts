import { relations } from "drizzle-orm/relations";
import { customers, sales } from "../index";

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(sales),
}));
