"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryEmployments = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const index_1 = require("../index");
exports.inventoryEmployments = (0, pg_core_1.pgTable)("logiex_inventory_employments", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    employee_id: (0, pg_core_1.uuid)("employee_id").notNull(),
    inventory: (0, pg_core_1.varchar)("inventory", { length: 80 }).notNull(),
    hire_date: (0, pg_core_1.timestamp)("hire_date", { mode: "string" }).defaultNow(),
    termination_date: (0, pg_core_1.timestamp)("termination_date", { mode: "string" }),
    resign_date: (0, pg_core_1.timestamp)("resign_date", { mode: "string" }),
    transfer_date: (0, pg_core_1.timestamp)("transfer_date", { mode: "string" }),
    employee_status: (0, pg_core_1.boolean)("employee_status").default(false),
    created_at: (0, pg_core_1.timestamp)("created_at", { mode: "string" }).defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at", { mode: "string" }),
}, (table) => {
    return {
        employeeIdx: (0, pg_core_1.index)("inventory_employment_employee_idx").on(table.employee_id),
        inventoryIdx: (0, pg_core_1.index)("inventory_employment_inventory_idx").on(table.inventory),
        employeeIdFk: (0, pg_core_1.foreignKey)({
            columns: [table.employee_id],
            foreignColumns: [index_1.users.id],
            name: "fk_employee_id",
        })
            .onUpdate("cascade")
            .onDelete("set null"),
        inventoryFk: (0, pg_core_1.foreignKey)({
            columns: [table.inventory],
            foreignColumns: [index_1.inventories.name],
            name: "fk_inventory",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
    };
});
