"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customers = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.customers = (0, pg_core_1.pgTable)("logiex_customers", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)("name", { length: 80 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 150 }).unique(),
    phone: (0, pg_core_1.varchar)("phone", { length: 16 }).unique(),
    address: (0, pg_core_1.text)("address"),
    created_at: (0, pg_core_1.timestamp)("created_at", { mode: "string" }).defaultNow(),
}, (table) => {
    return {
        nameIdx: (0, pg_core_1.index)("customers_name_idx").on(table.name),
    };
});
