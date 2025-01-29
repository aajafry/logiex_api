"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferProductsRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const index_1 = require("../index");
exports.transferProductsRelations = (0, relations_1.relations)(index_1.transferProducts, ({ one }) => ({
    product: one(index_1.products, {
        fields: [index_1.transferProducts.product],
        references: [index_1.products.name],
    }),
    transfer: one(index_1.transfers, {
        fields: [index_1.transferProducts.trf_id],
        references: [index_1.transfers.trf_id],
    }),
    purchase: one(index_1.purchases, {
        fields: [index_1.transferProducts.mr_id],
        references: [index_1.purchases.mr_id],
    }),
}));
