"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseProductsController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const index_2 = require("../services/index");
exports.purchaseProductsController = {
    retrieveAll: (async (req, res) => {
        try {
            const allPurchaseProducts = await connection_1.db.query.purchaseProducts.findMany({
                orderBy: [(0, drizzle_orm_1.desc)(index_1.purchaseProducts.created_at)],
                with: {
                    purchase: false,
                    product: false,
                },
            });
            res.status(200).json({
                message: "Purchase products retrieved successfully",
                records: allPurchaseProducts,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving purchase products", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving purchase products. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveById: (async (req, res) => {
        try {
            const { id } = req.params;
            const purchaseProduct = await connection_1.db.query.purchaseProducts.findFirst({
                where: (0, drizzle_orm_1.eq)(index_1.purchaseProducts.id, id),
                orderBy: [(0, drizzle_orm_1.desc)(index_1.purchaseProducts.created_at)],
                with: {
                    purchase: false,
                    product: false,
                },
            });
            if (!purchaseProduct) {
                return res.status(404).json({
                    message: `The purchase product ID ${id} was not found. Please verify the ID and try again.`,
                });
            }
            res.status(200).json({
                message: "Purchase product retrieved successfully",
                record: purchaseProduct,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving purchase product", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving the purchase product. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    updateById: (async (req, res) => {
        try {
            const { id } = req.params;
            const { quantity, discount, unit_price } = await index_1.updatePurchaseProductSchema.parseAsync(req.body);
            const [existingPurchaseProduct] = await connection_1.db
                .select()
                .from(index_1.purchaseProducts)
                .where((0, drizzle_orm_1.eq)(index_1.purchaseProducts.id, id))
                .limit(1);
            if (!existingPurchaseProduct) {
                return res.status(404).json({
                    message: `The purchase product ID "${id}" was not found. Please verify the ID.`,
                });
            }
            const { mr_id: existingPurchaseProductMrId, product: existingPurchaseProductName, quantity: existingPurchaseProductQuantity, unit_price: existingPurchaseProductUnitPrice, discount: existingPurchaseProductDiscount, } = existingPurchaseProduct;
            const productQty = quantity || existingPurchaseProductQuantity;
            const unitPrice = unit_price || existingPurchaseProductUnitPrice;
            const discountPrice = discount || existingPurchaseProductDiscount;
            const totalPrice = Number((productQty * unitPrice * (1 - discountPrice / 100)).toFixed(3));
            let updatedPurchase;
            await connection_1.db.transaction(async (tx) => {
                [updatedPurchase] = await tx
                    .update(index_1.purchaseProducts)
                    .set({
                    quantity: productQty,
                    unit_price: unitPrice,
                    discount: discountPrice,
                    total_price: totalPrice,
                    updated_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.eq)(index_1.purchaseProducts.id, id))
                    .returning();
                await tx
                    .update(index_1.inventoryProducts)
                    .set({
                    quantity: productQty,
                    updated_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ilike)(index_1.inventoryProducts.mr_id, existingPurchaseProductMrId), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.product, existingPurchaseProductName)));
                const updatedTotalPrice = await (0, index_2.calculatePurchasePrice)(existingPurchaseProductMrId, tx);
                await tx
                    .update(index_1.purchases)
                    .set({
                    total_price: updatedTotalPrice,
                    updated_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.ilike)(index_1.purchases.mr_id, existingPurchaseProductMrId));
            });
            res.status(200).json({
                message: `The purchase product ID "${id}" has been updated successfully.`,
                purchase: updatedPurchase,
            });
        }
        catch (error) {
            console.error("An error occurred while updating purchase product:", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while updating the purchase product. Please try again.",
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
                    .delete(index_1.purchaseProducts)
                    .where((0, drizzle_orm_1.eq)(index_1.purchaseProducts.id, id))
                    .returning();
                if (!deletedRecord) {
                    tx.rollback();
                }
                const { mr_id, product } = deletedRecord;
                await tx
                    .delete(index_1.inventoryProducts)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ilike)(index_1.inventoryProducts.mr_id, mr_id), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.product, product)))
                    .returning();
                const updatedTotalPrice = await (0, index_2.calculatePurchasePrice)(mr_id, tx);
                await tx
                    .update(index_1.purchases)
                    .set({
                    total_price: updatedTotalPrice,
                    updated_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.ilike)(index_1.purchases.mr_id, mr_id));
            });
            res.status(200).json({
                message: `The purchase product ID "${id}" has been deleted successfully`,
            });
        }
        catch (error) {
            console.error("An error occurred while deleting purchase product", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while deleting the purchase product. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
};
