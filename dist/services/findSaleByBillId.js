"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSaleByBillId = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const findSaleByBillId = async (billId) => {
    const sale = await connection_1.db.query.sales.findFirst({
        where: (0, drizzle_orm_1.ilike)(index_1.sales.bill_id, billId),
        with: {
            products: true,
        },
    });
    return sale ? sale : null;
};
exports.findSaleByBillId = findSaleByBillId;
