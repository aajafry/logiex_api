"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saleProductsRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const index_1 = require("../index");
exports.saleProductsRelations = (0, relations_1.relations)(index_1.saleProducts, ({ one }) => ({
    sale: one(index_1.sales, {
        fields: [index_1.saleProducts.bill_id],
        references: [index_1.sales.bill_id],
    }),
    product: one(index_1.products, {
        fields: [index_1.saleProducts.product],
        references: [index_1.products.name],
    }),
    purchase: one(index_1.purchases, {
        fields: [index_1.saleProducts.mr_id],
        references: [index_1.purchases.mr_id],
    }),
    inventory: one(index_1.inventories, {
        fields: [index_1.saleProducts.inventory],
        references: [index_1.inventories.name],
    }),
}));
