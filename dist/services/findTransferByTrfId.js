"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTransferByTrfId = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const findTransferByTrfId = async (trfId, ctx = connection_1.db) => {
    const [transfer] = await ctx
        .select()
        .from(index_1.transfers)
        .where((0, drizzle_orm_1.ilike)(index_1.transfers.trf_id, trfId))
        .limit(1);
    return transfer ? transfer : null;
};
exports.findTransferByTrfId = findTransferByTrfId;
