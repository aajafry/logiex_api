"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saleProductsController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const index_2 = require("../services/index");
exports.saleProductsController = {
    retrieveAll: (async (req, res) => {
        try {
            const allSaleProducts = await connection_1.db.query.saleProducts.findMany({
                orderBy: [(0, drizzle_orm_1.desc)(index_1.saleProducts.created_at)],
                with: {
                    sale: false,
                    product: false,
                    purchase: false,
                    inventory: false,
                },
            });
            res.status(200).json({
                message: "Sale products retrieved successfully",
                records: allSaleProducts,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving sale products", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving sale products. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveById: (async (req, res) => {
        try {
            const { id } = req.params;
            const saleProduct = await connection_1.db.query.saleProducts.findFirst({
                where: (0, drizzle_orm_1.eq)(index_1.saleProducts.id, id),
                orderBy: [(0, drizzle_orm_1.desc)(index_1.saleProducts.created_at)],
                with: {
                    sale: false,
                    product: false,
                    purchase: false,
                    inventory: false,
                },
            });
            if (!saleProduct) {
                return res.status(404).json({
                    message: `The sale product ID ${id} was not found. Please verify the ID and try again.`,
                });
            }
            res.status(200).json({
                message: "Sale product retrieved successfully",
                record: saleProduct,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving sale product", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving the sale product. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    updateById: (async (req, res) => {
        try {
            await index_1.updateSaleProductSchema.parseAsync(req.body);
            const { id } = req.params;
            const { quantity, unit_price, discount } = req.body;
            const parseQuantity = parseInt(quantity);
            const parseDiscount = parseFloat(discount);
            const parseUnitPrice = parseFloat(unit_price);
            const [existingSaleProduct] = await connection_1.db
                .select()
                .from(index_1.saleProducts)
                .where((0, drizzle_orm_1.eq)(index_1.saleProducts.id, id))
                .limit(1);
            if (!existingSaleProduct) {
                return res.status(404).json({
                    message: `The sale product ID "${id}" was not found. Please verify the ID.`,
                });
            }
            const { bill_id: existingSaleProductBillId, mr_id: existingSaleProductMrId, product: existingSaleProductName, quantity: existingSaleProductQuantity, inventory: existingSaleProductInventory, unit_price: existingSaleProductUnitPrice, discount: existingSaleProductDiscount, } = existingSaleProduct;
            if (parseQuantity && existingSaleProductQuantity < parseQuantity) {
                const qtyDifference = parseQuantity - existingSaleProductQuantity;
                const [inventoryQuery] = await connection_1.db
                    .select()
                    .from(index_1.inventoryProducts)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ilike)(index_1.inventoryProducts.mr_id, existingSaleProductMrId), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.inventory, existingSaleProductInventory), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.product, existingSaleProductName), (0, drizzle_orm_1.gte)(index_1.inventoryProducts.quantity, qtyDifference)))
                    .limit(1);
                if (!inventoryQuery) {
                    return res.status(404).json({
                        message: "Exceeds the available quantity limit.",
                    });
                }
            }
            const productQty = parseQuantity || existingSaleProductQuantity;
            const unitPrice = parseUnitPrice || existingSaleProductUnitPrice;
            const discountPrice = parseDiscount || existingSaleProductDiscount;
            const totalPrice = productQty * unitPrice - (productQty * unitPrice * discountPrice) / 100;
            const updatedData = {
                quantity: productQty,
                unit_price: unitPrice,
                discount: discountPrice,
                total_price: totalPrice,
                updated_at: new Date().toISOString(),
            };
            let updatedSale;
            await connection_1.db.transaction(async (tx) => {
                [updatedSale] = await tx
                    .update(index_1.saleProducts)
                    .set(updatedData)
                    .where((0, drizzle_orm_1.eq)(index_1.saleProducts.id, id))
                    .returning();
                const updatedTotalPrice = await (0, index_2.calculateSalePrice)(existingSaleProductBillId, tx);
                await tx
                    .update(index_1.sales)
                    .set({
                    total_amount: updatedTotalPrice,
                    updated_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.ilike)(index_1.sales.bill_id, existingSaleProductBillId))
                    .returning();
                await tx
                    .update(index_1.inventoryProducts)
                    .set({
                    quantity: (0, drizzle_orm_1.sql) `${index_1.inventoryProducts.quantity} + ${existingSaleProductQuantity}`,
                    updated_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ilike)(index_1.inventoryProducts.mr_id, existingSaleProductMrId), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.product, existingSaleProductName), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.inventory, existingSaleProductInventory)))
                    .returning();
                await tx
                    .update(index_1.inventoryProducts)
                    .set({
                    quantity: (0, drizzle_orm_1.sql) `${index_1.inventoryProducts.quantity} - ${productQty}`,
                    updated_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ilike)(index_1.inventoryProducts.mr_id, existingSaleProductMrId), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.product, existingSaleProductName), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.inventory, existingSaleProductInventory)))
                    .returning();
            });
            res.status(200).json({
                message: `The sale product ID "${id}" has been updated successfully.`,
                sale: updatedSale,
            });
        }
        catch (error) {
            console.error("An error occurred while updating sale product", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while updating the sale product. Please try again.",
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
                    .delete(index_1.saleProducts)
                    .where((0, drizzle_orm_1.eq)(index_1.saleProducts.id, id))
                    .returning();
                if (!deletedRecord) {
                    tx.rollback();
                }
                const { bill_id: deletedRecordBillId, mr_id: deletedRecordMrId, product: deletedRecordProduct, quantity: deletedRecordQuantity, inventory: deletedRecordInventory, } = deletedRecord;
                const updatedTotalPrice = await (0, index_2.calculateSalePrice)(deletedRecordBillId, tx);
                await tx
                    .update(index_1.sales)
                    .set({
                    total_amount: updatedTotalPrice,
                    updated_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.ilike)(index_1.sales.bill_id, deletedRecordBillId))
                    .returning();
                await tx
                    .update(index_1.inventoryProducts)
                    .set({
                    quantity: (0, drizzle_orm_1.sql) `${index_1.inventoryProducts.quantity} + ${deletedRecordQuantity}`,
                    updated_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ilike)(index_1.inventoryProducts.mr_id, deletedRecordMrId), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.product, deletedRecordProduct), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.inventory, deletedRecordInventory)))
                    .returning();
            });
            res.status(200).json({
                message: `The sale product ID "${id}" has been deleted successfully`,
            });
        }
        catch (error) {
            console.error("An error occurred while deleting sale product by id", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An error occurred while deleting sale product by id",
                    error: error.message,
                });
            }
        }
    }),
};
