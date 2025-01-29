"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehiclesRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const index_1 = require("../index");
exports.vehiclesRelations = (0, relations_1.relations)(index_1.vehicles, ({ many }) => ({
    shipments: many(index_1.shipments),
}));
