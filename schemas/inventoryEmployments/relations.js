import { relations } from "drizzle-orm/relations";
import { users, inventories, inventoryEmployments } from "../index.js";

export const inventoryEmploymentsRelations = relations(
  inventoryEmployments,
  ({ one }) => ({
    employee: one(users, {
      fields: [inventoryEmployments.employee_id],
      references: [users.id],
    }),
    inventory: one(inventories, {
      fields: [inventoryEmployments.inventory],
      references: [inventories.name],
    }),
  })
);
