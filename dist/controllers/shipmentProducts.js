"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentProductsController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const index_2 = require("../services/index");
exports.shipmentProductsController = {
    retrieveAll: (async (req, res) => {
        try {
            const allShipmentProduct = await connection_1.db.query.shipmentProducts.findMany({
                orderBy: [(0, drizzle_orm_1.desc)(index_1.shipmentProducts.created_at)],
                columns: {
                    bill_id: false,
                },
                with: {
                    shipment: false,
                    sale: {
                        columns: {
                            id: false,
                        },
                    },
                },
            });
            res.status(200).json({
                message: "Shipment products retrieved successfully",
                records: allShipmentProduct,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving all Shipment product", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving Shipment product. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveById: (async (req, res) => {
        try {
            const { id } = req.params;
            const shipmentProduct = await connection_1.db.query.shipmentProducts.findFirst({
                where: (0, drizzle_orm_1.eq)(index_1.shipmentProducts.id, id),
                orderBy: [(0, drizzle_orm_1.desc)(index_1.shipmentProducts.created_at)],
                columns: {
                    bill_id: false,
                },
                with: {
                    shipment: false,
                    sale: {
                        columns: {
                            id: false,
                        },
                    },
                },
            });
            if (!shipmentProduct) {
                return res.status(404).json({
                    message: `Shipment product ID ${id} was not found. Please verify the ID and try again.`,
                });
            }
            res.status(200).json({
                message: "Shipment product retrieved successfully",
                record: shipmentProduct,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving shipment product", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving the shipment product. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    updateById: (async (req, res) => {
        try {
            await index_1.updateShipmentProductSchema.parseAsync(req.body);
            const { id } = req.params;
            const { shipment_id, bill_id } = req.body;
            const [existingShipmentProduct] = await connection_1.db
                .select()
                .from(index_1.shipmentProducts)
                .where((0, drizzle_orm_1.eq)(index_1.shipmentProducts.id, id))
                .limit(1);
            if (!existingShipmentProduct) {
                return res.status(404).json({
                    message: `Shipment product ID ${id} was not found. Please verify the ID and try again.`,
                });
            }
            const { shipment_id: existingShipmentProductSID, bill_id: existingShipmentProductBillID, } = existingShipmentProduct;
            if (shipment_id && shipment_id !== existingShipmentProductSID) {
                const shipmentValidation = await (0, index_2.findShipmentBySid)(shipment_id);
                if (!shipmentValidation) {
                    return res.status(404).json({
                        message: `The shipment ID ${shipment_id} was not found. Please verify the ID and try again.`,
                    });
                }
            }
            if (bill_id && bill_id !== existingShipmentProductBillID) {
                const billValidation = await (0, index_2.findSaleByBillId)(bill_id);
                if (!billValidation) {
                    return res.status(404).json({
                        message: `The BILL ID ${bill_id} was not found. Please verify the ID and try again.`,
                    });
                }
            }
            const updatedData = {
                shipment_id: shipment_id || existingShipmentProductSID,
                bill_id: bill_id || existingShipmentProductBillID,
                updated_at: new Date().toISOString(),
            };
            const [updatedShipmentProduct] = await connection_1.db
                .update(index_1.shipmentProducts)
                .set(updatedData)
                .where((0, drizzle_orm_1.eq)(index_1.shipmentProducts.id, id))
                .returning();
            if (!updatedShipmentProduct) {
                return res.status(409).json({
                    message: `An error occurred while updating the shipment product. Please try again.`,
                });
            }
            res.status(200).json({
                message: "Shipment product updated successfully",
                record: updatedShipmentProduct,
            });
        }
        catch (error) {
            console.error("An error occurred while updating shipment product", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while updating shipment product. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    deleteById: (async (req, res) => {
        try {
            const { id } = req.params;
            const [deletedRecord] = await connection_1.db
                .delete(index_1.shipmentProducts)
                .where((0, drizzle_orm_1.eq)(index_1.shipmentProducts.id, id))
                .returning();
            if (!deletedRecord) {
                return res.status(404).json({
                    message: `Shipment product ID ${id} was not found. Please verify the ID and try again.`,
                });
            }
            res.status(200).json({
                message: "Shipment product deleted successfully",
                record: deletedRecord,
            });
        }
        catch (error) {
            console.error("An error occurred while deleting shipment product", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while deleting the shipment product. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
};
