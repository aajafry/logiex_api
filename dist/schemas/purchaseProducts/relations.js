"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseProductsRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const index_1 = require("../index");
exports.purchaseProductsRelations = (0, relations_1.relations)(index_1.purchaseProducts, ({ one }) => ({
    purchase: one(index_1.purchases, {
        fields: [index_1.purchaseProducts.mr_id],
        references: [index_1.purchases.mr_id],
    }),
    product: one(index_1.products, {
        fields: [index_1.purchaseProducts.product],
        references: [index_1.products.name],
    }),
}));
