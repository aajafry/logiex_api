import { relations } from "drizzle-orm/relations";
import { purchases, vendors } from "../index.js";


export const vendorsRelations = relations(vendors, ({ many }) => ({
  sales: many(purchases),
}));
