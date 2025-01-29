"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSalePrice = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const calculateSalePrice = async (billId, ctx = connection_1.db) => {
    const products = await ctx
        .select()
        .from(index_1.saleProducts)
        .where((0, drizzle_orm_1.ilike)(index_1.saleProducts.bill_id, billId));
    return products.reduce((total, product) => total + product.total_price, 0);
};
exports.calculateSalePrice = calculateSalePrice;
