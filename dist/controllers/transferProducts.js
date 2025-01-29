"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferProductsController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const index_2 = require("../services/index");
exports.transferProductsController = {
    retrieveAll: (async (req, res) => {
        try {
            const allTransferProducts = await connection_1.db.query.transferProducts.findMany({
                orderBy: [(0, drizzle_orm_1.desc)(index_1.transferProducts.created_at)],
                with: {
                    transfer: false,
                    product: false,
                },
            });
            res.status(200).json({
                message: "Transfer products retrieved successfully",
                records: allTransferProducts,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving transfer products", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving transfer products. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveById: (async (req, res) => {
        try {
            const { id } = req.params;
            const transferProduct = await connection_1.db.query.transferProducts.findFirst({
                where: (0, drizzle_orm_1.eq)(index_1.transferProducts.id, id),
                orderBy: [(0, drizzle_orm_1.desc)(index_1.transferProducts.created_at)],
                with: {
                    transfer: false,
                    product: false,
                },
            });
            if (!transferProduct) {
                return res.status(404).json({
                    message: `The transfer product ID ${id} was not found. Please verify the ID and try again.`,
                });
            }
            res.status(200).json({
                message: "Transfer product retrieved successfully",
                record: transferProduct,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving transfer product", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving the transfer product. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    updateById: (async (req, res) => {
        try {
            await index_1.updateTransferProductSchema.parseAsync(req.body);
            const { id } = req.params;
            const { quantity: newQuantity } = req.body;
            const [existingTransferProduct] = await connection_1.db
                .select()
                .from(index_1.transferProducts)
                .where((0, drizzle_orm_1.eq)(index_1.transferProducts.id, id))
                .limit(1);
            if (!existingTransferProduct) {
                return res.status(404).json({
                    message: `The transfer product ID ${id} was not found. Please verify the ID and try again.`,
                });
            }
            const { trf_id: existingTransferProductTrfId, mr_id: existingTransferProductMrId, product: existingTransferProductName, quantity: existingTransferProductQuantity, } = existingTransferProduct;
            const qtyDifference = Math.abs(existingTransferProductQuantity - (newQuantity || 0));
            const existingTransfer = await (0, index_2.findTransferByTrfId)(existingTransferProductTrfId);
            if (!existingTransfer) {
                return res.status(404).json({
                    message: `The transfer ID "${existingTransferProductTrfId}" was not found. Please verify the transfer ID and try again.`,
                });
            }
            const { source_inventory: existingTransferSourceInventory, destination_inventory: existingTransferDestinationInventory, } = existingTransfer;
            const [productQuery] = await connection_1.db
                .select()
                .from(index_1.inventoryProducts)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ilike)(index_1.inventoryProducts.inventory, existingTransferSourceInventory), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.product, existingTransferProductName), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.mr_id, existingTransferProductMrId), (0, drizzle_orm_1.gte)(index_1.inventoryProducts.quantity, qtyDifference)))
                .limit(1);
            if (!productQuery) {
                return res.status(404).json({
                    message: `The source inventory "${existingTransferSourceInventory}" does not have enough "${existingTransferProductName}" to fulfill the transfer product with ID "${id}". Please verify the inventory and try again.`,
                });
            }
            let altQty;
            if (newQuantity === undefined) {
                altQty = newQuantity || existingTransferProductQuantity;
            }
            else {
                altQty = newQuantity;
            }
            let updatedRecord;
            await connection_1.db.transaction(async (tx) => {
                await tx
                    .update(index_1.inventoryProducts)
                    .set({
                    quantity: (0, drizzle_orm_1.sql) `(${index_1.inventoryProducts.quantity} + ${existingTransferProductQuantity}) - ${altQty}`,
                    updated_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ilike)(index_1.inventoryProducts.inventory, existingTransferSourceInventory), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.product, existingTransferProductName), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.mr_id, existingTransferProductMrId)))
                    .returning();
                await tx
                    .update(index_1.inventoryProducts)
                    .set({
                    quantity: (0, drizzle_orm_1.sql) `(${index_1.inventoryProducts.quantity} - ${existingTransferProductQuantity}) + ${altQty}`,
                    updated_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ilike)(index_1.inventoryProducts.inventory, existingTransferDestinationInventory), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.product, existingTransferProductName), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.mr_id, existingTransferProductMrId)))
                    .returning();
                [updatedRecord] = await tx
                    .update(index_1.transferProducts)
                    .set({
                    quantity: altQty,
                    updated_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.eq)(index_1.transferProducts.id, id))
                    .returning();
            });
            res.status(200).json({
                message: "Transfer product updated successfully",
                record: updatedRecord,
            });
        }
        catch (error) {
            console.error("An error occurred while updating transfer product", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while updating the transfer product. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    deleteById: (async (req, res) => {
        try {
            const { id } = req.params;
            let deletedRecord;
            await connection_1.db.transaction(async (tx) => {
                [deletedRecord] = await tx
                    .delete(index_1.transferProducts)
                    .where((0, drizzle_orm_1.eq)(index_1.transferProducts.id, id))
                    .returning();
                if (!deletedRecord) {
                    tx.rollback();
                }
                const { trf_id: deletedTrfId, mr_id: deletedMrId, product: deletedProduct, quantity: deletedQuantity, } = deletedRecord;
                const existingTransfer = await (0, index_2.findTransferByTrfId)(deletedTrfId, tx);
                if (!existingTransfer) {
                    tx.rollback();
                }
                const { source_inventory: existingTransferSourceInventory, destination_inventory: existingTransferDestinationInventory, } = existingTransfer;
                const [DestinationInventoryProduct] = await tx
                    .select()
                    .from(index_1.inventoryProducts)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ilike)(index_1.inventoryProducts.inventory, existingTransferDestinationInventory), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.product, deletedProduct), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.mr_id, deletedMrId)))
                    .limit(1);
                const { quantity: availableQuantity } = DestinationInventoryProduct;
                await tx
                    .update(index_1.inventoryProducts)
                    .set({
                    quantity: (0, drizzle_orm_1.sql) `${index_1.inventoryProducts.quantity} + ${availableQuantity}`,
                    updated_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ilike)(index_1.inventoryProducts.inventory, existingTransferSourceInventory), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.product, deletedProduct), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.mr_id, deletedMrId)));
                await tx
                    .delete(index_1.inventoryProducts)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ilike)(index_1.inventoryProducts.inventory, existingTransferDestinationInventory), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.product, deletedProduct), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.mr_id, deletedMrId)));
            });
            res.status(200).json({
                message: "Transfer product deleted successfully",
            });
        }
        catch (error) {
            console.error("An error occurred while deleting transfer product", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while deleting the transfer product. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
};
