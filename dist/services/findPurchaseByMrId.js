"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPurchaseByMrId = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const findPurchaseByMrId = async (mrId) => {
    const [purchase] = await connection_1.db
        .select()
        .from(index_1.purchases)
        .where((0, drizzle_orm_1.ilike)(index_1.purchases.mr_id, mrId))
        .limit(1);
    return purchase ? purchase : null;
};
exports.findPurchaseByMrId = findPurchaseByMrId;
