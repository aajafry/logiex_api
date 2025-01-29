"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryProductsRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const index_1 = require("../index");
exports.inventoryProductsRelations = (0, relations_1.relations)(index_1.inventoryProducts, ({ one }) => ({
    purchase: one(index_1.purchases, {
        fields: [index_1.inventoryProducts.mr_id],
        references: [index_1.purchases.mr_id],
    }),
    inventory: one(index_1.inventories, {
        fields: [index_1.inventoryProducts.inventory],
        references: [index_1.inventories.name],
    }),
    product: one(index_1.products, {
        fields: [index_1.inventoryProducts.product],
        references: [index_1.products.name],
    }),
}));
