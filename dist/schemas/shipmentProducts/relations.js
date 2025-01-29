"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentProductsRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const index_1 = require("../index");
exports.shipmentProductsRelations = (0, relations_1.relations)(index_1.shipmentProducts, ({ one }) => ({
    shipment: one(index_1.shipments, {
        fields: [index_1.shipmentProducts.shipment_id],
        references: [index_1.shipments.shipment_id],
    }),
    sale: one(index_1.sales, {
        fields: [index_1.shipmentProducts.bill_id],
        references: [index_1.sales.bill_id],
    }),
}));
