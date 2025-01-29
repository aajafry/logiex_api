"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryProductsController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
exports.inventoryProductsController = {
    retrieveAll: (async (req, res) => {
        try {
            const inventoryProductRecords = await connection_1.db.query.inventoryProducts.findMany({
                orderBy: [(0, drizzle_orm_1.desc)(index_1.inventoryProducts.created_at)],
                with: {
                    purchase: false,
                    inventory: false,
                    product: false,
                },
            });
            res.status(200).json({
                message: "All inventories with associated products retrieved successfully",
                records: inventoryProductRecords,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving all inventory with associated products:", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving all inventory with associated products. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveById: (async (req, res) => {
        try {
            const { id } = req.params;
            const inventoryProductRecord = await connection_1.db.query.inventoryProducts.findFirst({
                where: (0, drizzle_orm_1.eq)(index_1.inventoryProducts.id, id),
                orderBy: [(0, drizzle_orm_1.desc)(index_1.inventoryProducts.created_at)],
                with: {
                    purchase: false,
                    inventory: false,
                    product: false,
                },
            });
            if (!inventoryProductRecord) {
                return res.status(404).json({
                    message: `Inventory with associated product not found with the provided ID "${id}". Please verify the ID.`,
                });
            }
            res.status(200).json({
                message: "Inventory with associated product retrieved successfully",
                record: inventoryProductRecord,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving inventory with associated product", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving inventory with associated product. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
};
