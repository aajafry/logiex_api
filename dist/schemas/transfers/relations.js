"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfersRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const index_1 = require("../index");
exports.transfersRelations = (0, relations_1.relations)(index_1.transfers, ({ one, many }) => ({
    source: one(index_1.inventories, {
        fields: [index_1.transfers.source_inventory],
        references: [index_1.inventories.name],
        relationName: "source",
    }),
    destination: one(index_1.inventories, {
        fields: [index_1.transfers.destination_inventory],
        references: [index_1.inventories.name],
        relationName: "destination",
    }),
    products: many(index_1.transferProducts),
}));
