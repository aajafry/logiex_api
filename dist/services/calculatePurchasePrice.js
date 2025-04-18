"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePurchasePrice = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const calculatePurchasePrice = async (mrId, ctx = connection_1.db) => {
    const products = await ctx
        .select()
        .from(index_1.purchaseProducts)
        .where((0, drizzle_orm_1.ilike)(index_1.purchaseProducts.mr_id, mrId));
    return products.reduce((total, product) => total + Number(product.total_price), 0);
};
exports.calculatePurchasePrice = calculatePurchasePrice;
