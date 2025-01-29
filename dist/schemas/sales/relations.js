"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const index_1 = require("../index");
exports.salesRelations = (0, relations_1.relations)(index_1.sales, ({ one, many }) => ({
    customer: one(index_1.customers, {
        fields: [index_1.sales.customer_id],
        references: [index_1.customers.id],
    }),
    inventory: one(index_1.inventories, {
        fields: [index_1.sales.inventory],
        references: [index_1.inventories.name],
    }),
    products: many(index_1.saleProducts),
    shipments: many(index_1.shipmentProducts),
}));
