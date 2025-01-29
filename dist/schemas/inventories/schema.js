"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventories = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.inventories = (0, pg_core_1.pgTable)("logiex_inventories", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)("name", { length: 80 }).unique().notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 150 }).unique(),
    phone: (0, pg_core_1.varchar)("phone", { length: 16 }).unique(),
    description: (0, pg_core_1.text)("description"),
    address: (0, pg_core_1.text)("address").notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at", { mode: "string" }).defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at", { mode: "string" }),
}, (table) => {
    return {
        nameIdx: (0, pg_core_1.index)("inventories_name_idx").on(table.name),
    };
});
