"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentsRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const index_1 = require("../index");
exports.shipmentsRelations = (0, relations_1.relations)(index_1.shipments, ({ one, many }) => ({
    vehicle: one(index_1.vehicles, {
        fields: [index_1.shipments.vehicle_vin],
        references: [index_1.vehicles.vin],
    }),
    captain: one(index_1.users, {
        fields: [index_1.shipments.captain_id],
        references: [index_1.users.id],
    }),
    items: many(index_1.shipmentProducts),
}));
