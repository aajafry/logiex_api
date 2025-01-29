"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchasesRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const index_1 = require("../index");
exports.purchasesRelations = (0, relations_1.relations)(index_1.purchases, ({ one, many }) => ({
    vendor: one(index_1.vendors, {
        fields: [index_1.purchases.vendor],
        references: [index_1.vendors.name],
    }),
    inventory: one(index_1.inventories, {
        fields: [index_1.purchases.inventory],
        references: [index_1.inventories.name],
    }),
    products: many(index_1.purchaseProducts),
    storages: many(index_1.inventoryProducts),
    sales: many(index_1.saleProducts),
}));
