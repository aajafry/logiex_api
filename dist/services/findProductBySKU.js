"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProductBySKU = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const findProductBySKU = async (sku) => {
    const [product] = await connection_1.db
        .select()
        .from(index_1.products)
        .where((0, drizzle_orm_1.ilike)(index_1.products.sku, sku))
        .limit(1);
    return product ? product : null;
};
exports.findProductBySKU = findProductBySKU;
