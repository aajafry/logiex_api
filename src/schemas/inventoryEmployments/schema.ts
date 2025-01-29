import {
  boolean,
  foreignKey,
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { inventories, users } from "../index";

export const inventoryEmployments = pgTable(
  "logiex_inventory_employments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employee_id: uuid("employee_id").notNull(),
    inventory: varchar("inventory", { length: 80 }).notNull(),
    hire_date: timestamp("hire_date", { mode: "string" }).defaultNow(),
    termination_date: timestamp("termination_date", { mode: "string" }),
    resign_date: timestamp("resign_date", { mode: "string" }),
    transfer_date: timestamp("transfer_date", { mode: "string" }),
    employee_status: boolean("employee_status").default(false),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      employeeIdx: index("inventory_employment_employee_idx").on(
        table.employee_id
      ),
      inventoryIdx: index("inventory_employment_inventory_idx").on(
        table.inventory
      ),
      employeeIdFk: foreignKey({
        columns: [table.employee_id],
        foreignColumns: [users.id],
        name: "fk_employee_id",
      })
        .onUpdate("cascade")
        .onDelete("set null"),
      inventoryFk: foreignKey({
        columns: [table.inventory],
        foreignColumns: [inventories.name],
        name: "fk_inventory",
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  }
);
