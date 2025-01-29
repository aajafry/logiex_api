"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryEmploymentsRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const index_1 = require("../index");
exports.inventoryEmploymentsRelations = (0, relations_1.relations)(index_1.inventoryEmployments, ({ one }) => ({
    employee: one(index_1.users, {
        fields: [index_1.inventoryEmployments.employee_id],
        references: [index_1.users.id],
    }),
    inventory: one(index_1.inventories, {
        fields: [index_1.inventoryEmployments.inventory],
        references: [index_1.inventories.name],
    }),
}));
