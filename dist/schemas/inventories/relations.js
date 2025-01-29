"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoriesRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const index_1 = require("../index");
exports.inventoriesRelations = (0, relations_1.relations)(index_1.inventories, ({ many }) => ({
    inventories: many(index_1.inventoryProducts),
    purchases: many(index_1.purchases),
    sales: many(index_1.sales),
    saleProducts: many(index_1.saleProducts),
    employees: many(index_1.inventoryEmployments),
    source: many(index_1.transfers, {
        relationName: "source",
    }),
    destination: many(index_1.transfers, {
        relationName: "destination",
    }),
}));
