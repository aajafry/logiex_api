"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchasesController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const index_2 = require("../services/index");
exports.purchasesController = {
    create: (async (req, res) => {
        try {
            const { mr_id, purchase_date, vendor, inventory, adjustment, products } = req.body;
            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({ message: "Products are required" });
            }
            await index_1.insertPurchaseSchema.parseAsync({
                mr_id,
                purchase_date,
                vendor,
                inventory,
                adjustment,
            });
            const existingPurchase = await (0, index_2.findPurchaseByMrId)(mr_id);
            if (existingPurchase) {
                return res.status(409).json({
                    message: `The purchase with the MR ID "${mr_id}" already exists. Please choose a different MR ID.`,
                });
            }
            const vendorValidation = await (0, index_2.findVendorByName)(vendor);
            if (!vendorValidation) {
                return res.status(404).json({
                    message: `The vendor "${vendor}" was not found. Please verify the vendor.`,
                });
            }
            const inventoryValidation = await (0, index_2.findInventoryByName)(inventory);
            if (!inventoryValidation) {
                return res.status(404).json({
                    message: `The inventory "${inventory}" was not found. Please verify the inventory.`,
                });
            }
            const productErrors = [];
            await Promise.all(products.map(async (product) => {
                await index_1.insertPurchaseProductSchema.parseAsync(product);
                const productVerification = await (0, index_2.findProductByName)(product.product);
                if (!productVerification) {
                    productErrors.push(`The product ${product.product} was not found. Please verify the product`);
                    return null;
                }
                return product;
            }));
            if (productErrors.length > 0) {
                return res.status(404).json({ message: productErrors });
            }
            const allPurchaseProducts = [];
            const newPurchase = await connection_1.db.transaction(async (tx) => {
                await tx
                    .insert(index_1.purchases)
                    .values({
                    mr_id,
                    purchase_date: purchase_date
                        ? purchase_date
                        : new Date().toISOString(),
                    vendor,
                    inventory,
                    adjustment,
                })
                    .returning();
                for (const product of products) {
                    const { product: productName, quantity, unit_price, discount, } = product;
                    const parseDiscount = parseFloat(discount) || 0;
                    const productTotalPrice = quantity * unit_price -
                        (quantity * unit_price * parseDiscount) / 100;
                    const [purchaseProduct] = await tx
                        .insert(index_1.purchaseProducts)
                        .values({
                        mr_id,
                        product: productName,
                        quantity,
                        unit_price,
                        discount: parseDiscount,
                        total_price: productTotalPrice,
                    })
                        .returning();
                    allPurchaseProducts.push(purchaseProduct);
                    await tx
                        .insert(index_1.inventoryProducts)
                        .values({
                        mr_id,
                        inventory,
                        product: productName,
                        quantity,
                    })
                        .returning();
                }
                const updatedTotalPrice = allPurchaseProducts.reduce((total, product) => total + parseFloat(product.total_price), 0);
                const [updatedpurchase] = await tx
                    .update(index_1.purchases)
                    .set({
                    total_price: (0, drizzle_orm_1.sql) `${updatedTotalPrice} - ${index_1.purchases.adjustment}`,
                    updated_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.ilike)(index_1.purchases.mr_id, mr_id))
                    .returning();
                return updatedpurchase;
            });
            res.status(201).json({
                message: `The purchase MR ID "${mr_id}" has been created successfully`,
                purchase: newPurchase,
                products: allPurchaseProducts,
            });
        }
        catch (error) {
            console.error("An error occurred while creating purchase", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while creating the purchase. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveAll: (async (req, res) => {
        try {
            const allPurchases = await connection_1.db.query.purchases.findMany({
                orderBy: [(0, drizzle_orm_1.desc)(index_1.purchases.created_at)],
                with: {
                    vendor: false,
                    inventory: false,
                    products: {
                        columns: {
                            id: false,
                            mr_id: false,
                        },
                    },
                    storages: {
                        columns: {
                            id: false,
                            mr_id: false,
                        },
                    },
                    sales: {
                        columns: {
                            id: false,
                            mr_id: false,
                        },
                    },
                },
            });
            res.status(200).json({
                message: "Purchases retrieved successfully",
                purchases: allPurchases,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving purchases", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving purchases. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveByMrId: (async (req, res) => {
        try {
            const { mrId } = req.params;
            const purchase = await connection_1.db.query.purchases.findFirst({
                where: (0, drizzle_orm_1.ilike)(index_1.purchases.mr_id, mrId),
                orderBy: [(0, drizzle_orm_1.desc)(index_1.purchases.created_at)],
                with: {
                    vendor: false,
                    inventory: false,
                    products: {
                        columns: {
                            mr_id: false,
                        },
                    },
                    storages: {
                        columns: {
                            id: false,
                            mr_id: false,
                        },
                    },
                    sales: {
                        columns: {
                            id: false,
                            mr_id: false,
                        },
                    },
                },
            });
            if (!purchase) {
                return res.status(404).json({
                    message: `The purchase MR ID "${mrId}" was not found. Please verify the MR ID and try again.`,
                });
            }
            res.status(200).json({
                message: "Purchase retrieved successfully",
                purchase,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving purchase", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving the purchase. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    updateByMrId: (async (req, res) => {
        try {
            const { mrId } = req.params;
            const { mr_id: mrIdBody, purchase_date: purchaseDate, vendor, inventory, adjustment, products, } = req.body;
            await index_1.updatePurchaseSchema.parseAsync({
                mr_id: mrIdBody,
                purchase_date: purchaseDate,
                vendor,
                inventory,
                adjustment,
            });
            const parsedAdjustment = parseFloat(adjustment);
            const existingPurchase = await (0, index_2.findPurchaseByMrId)(mrId);
            if (!existingPurchase) {
                return res.status(404).json({
                    message: `The purchase MR ID "${mrId}" was not found. Please verify the MR ID.`,
                });
            }
            const { mr_id: existingMrId, purchase_date: existingPurchaseDate, vendor: existingVendor, inventory: existingInventory, adjustment: existingAdjustment, total_price: existingTotalPrice, } = existingPurchase;
            if (mrIdBody && mrIdBody !== existingMrId) {
                const mrIdVerification = await (0, index_2.findPurchaseByMrId)(mrIdBody);
                if (mrIdVerification) {
                    return res.status(409).json({
                        message: `The purchase with the MR ID "${mrIdBody}" already exists. Please choose a different MR ID.`,
                    });
                }
            }
            if (vendor && vendor !== existingVendor) {
                const vendorValidation = await (0, index_2.findVendorByName)(vendor);
                if (!vendorValidation) {
                    return res.status(404).json({
                        message: `The vendor "${vendor}" was not found. Please verify the vendor.`,
                    });
                }
            }
            if (inventory && inventory !== existingInventory) {
                const inventoryValidation = await (0, index_2.findInventoryByName)(inventory);
                if (!inventoryValidation) {
                    return res.status(404).json({
                        message: `The inventory "${inventory}" was not found. Please verify the inventory.`,
                    });
                }
            }
            if (Array.isArray(products) && products.length > 0) {
                const productErrors = [];
                await Promise.all(products.map(async (product) => {
                    await index_1.insertPurchaseProductSchema.parseAsync(product);
                    const productVerification = await (0, index_2.findProductByName)(product.product);
                    if (!productVerification) {
                        productErrors.push(`The product ${product.product} was not found. Please verify the product`);
                    }
                }));
                if (productErrors.length > 0) {
                    return res.status(404).json({ message: productErrors });
                }
            }
            const updatedData = {
                mr_id: mrIdBody || existingMrId,
                purchase_date: purchaseDate || existingPurchaseDate,
                vendor: vendor || existingVendor,
                inventory: inventory || existingInventory,
                updated_at: new Date().toISOString(),
            };
            const oldProductTotalPrice = await (0, index_2.calculatePurchasePrice)(mrId);
            let updatedPurchase;
            const newlyPurchaseProducts = [];
            if (Array.isArray(products) && products.length > 0) {
                updatedPurchase = await connection_1.db.transaction(async (tx) => {
                    const [updatedPurchase] = await tx
                        .update(index_1.purchases)
                        .set(updatedData)
                        .where((0, drizzle_orm_1.ilike)(index_1.purchases.mr_id, mrId))
                        .returning();
                    for (const product of products) {
                        const { product: productName, quantity, unit_price: unitPrice, discount, } = product;
                        const parsedDiscount = parseFloat(discount) || 0;
                        const productTotalPrice = quantity * unitPrice -
                            (quantity * unitPrice * parsedDiscount) / 100;
                        const [purchaseProduct] = await tx
                            .insert(index_1.purchaseProducts)
                            .values({
                            mr_id: updatedPurchase.mr_id,
                            product: productName,
                            quantity,
                            unit_price: unitPrice,
                            discount: parsedDiscount,
                            total_price: productTotalPrice,
                        })
                            .returning();
                        newlyPurchaseProducts.push(purchaseProduct);
                        await tx
                            .insert(index_1.inventoryProducts)
                            .values({
                            mr_id: updatedPurchase.mr_id,
                            inventory: updatedPurchase.inventory,
                            product: productName,
                            quantity,
                        })
                            .returning();
                    }
                    const newlyProductTotalPrice = newlyPurchaseProducts.reduce((total, product) => total + parseFloat(product.total_price), 0);
                    const updatedTotalPrice = oldProductTotalPrice + newlyProductTotalPrice;
                    if (parsedAdjustment &&
                        (parsedAdjustment < 0 || parsedAdjustment > updatedTotalPrice)) {
                        tx.rollback();
                    }
                    const finalAdjustment = parsedAdjustment || parseFloat(existingAdjustment);
                    const finalTotalPrice = updatedTotalPrice - finalAdjustment;
                    const [finalUpdatedPurchase] = await tx
                        .update(index_1.purchases)
                        .set({
                        adjustment: finalAdjustment,
                        total_price: finalTotalPrice,
                        updated_at: new Date().toISOString(),
                    })
                        .where((0, drizzle_orm_1.ilike)(index_1.purchases.mr_id, updatedPurchase.mr_id))
                        .returning();
                    return finalUpdatedPurchase;
                });
            }
            else {
                if (parsedAdjustment &&
                    (parsedAdjustment < 0 || parsedAdjustment > oldProductTotalPrice)) {
                    return res.status(400).json({
                        message: "Adjustment amount must be between 0 and available total price.",
                    });
                }
                const finalAdjustment = parsedAdjustment || parseFloat(existingAdjustment);
                const finalTotalPrice = oldProductTotalPrice - finalAdjustment;
                [updatedPurchase] = await connection_1.db
                    .update(index_1.purchases)
                    .set({
                    ...updatedData,
                    adjustment: finalAdjustment,
                    total_price: finalTotalPrice,
                    updated_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.ilike)(index_1.purchases.mr_id, mrId))
                    .returning();
                if (!updatedPurchase) {
                    return res.status(404).json({
                        message: `An error occurred while updating the purchase MR ID "${mrId}". Please try again.`,
                    });
                }
                await connection_1.db
                    .update(index_1.inventoryProducts)
                    .set({
                    inventory: updatedPurchase.inventory,
                    updated_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.ilike)(index_1.inventoryProducts.mr_id, mrId))
                    .returning();
            }
            res.status(200).json({
                message: `The purchase MR ID "${mrId}" has been updated successfully`,
                purchase: updatedPurchase,
                products: newlyPurchaseProducts || [],
            });
        }
        catch (error) {
            console.error("An error occurred while updating purchase:", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while updating the purchase. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    deleteByMrId: (async (req, res) => {
        try {
            const { mrId } = req.params;
            const [existingPurchase] = await connection_1.db
                .select()
                .from(index_1.purchases)
                .where((0, drizzle_orm_1.ilike)(index_1.purchases.mr_id, mrId))
                .limit(1);
            if (!existingPurchase) {
                return res.status(404).json({
                    message: `The purchase with MR ID "${mrId}" was not found. Please verify the MR ID.`,
                });
            }
            const { inventory: existingInventory } = existingPurchase;
            await connection_1.db.transaction(async (tx) => {
                await tx
                    .delete(index_1.inventoryProducts)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ilike)(index_1.inventoryProducts.inventory, existingInventory), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.mr_id, mrId)));
                const [deletedPurchase] = await tx
                    .delete(index_1.purchases)
                    .where((0, drizzle_orm_1.ilike)(index_1.purchases.mr_id, mrId))
                    .returning();
                if (!deletedPurchase) {
                    throw new Error(`The purchase with MR ID "${mrId}" could not be deleted.`);
                    tx.rollback();
                }
            });
            res.status(200).json({
                message: `The purchase with MR ID "${mrId}" has been deleted successfully.`,
            });
        }
        catch (error) {
            console.error("An error occurred while deleting purchase by MR ID", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while deleting the purchase. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
};
