"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRelations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const index_1 = require("../index");
exports.productsRelations = (0, drizzle_orm_1.relations)(index_1.products, ({ one, many }) => ({
    category: one(index_1.categories, {
        fields: [index_1.products.category],
        references: [index_1.categories.name],
    }),
    purchases: many(index_1.purchaseProducts),
    sales: many(index_1.saleProducts),
    inventories: many(index_1.inventoryProducts),
    transfers: many(index_1.transferProducts),
}));
