"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findShipmentBySid = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const findShipmentBySid = async (shipmentId) => {
    const [shipment] = await connection_1.db
        .select()
        .from(index_1.shipments)
        .where((0, drizzle_orm_1.ilike)(index_1.shipments.shipment_id, shipmentId))
        .limit(1);
    return shipment ? shipment : null;
};
exports.findShipmentBySid = findShipmentBySid;
