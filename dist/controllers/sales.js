"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const index_2 = require("../services/index");
exports.salesController = {
    create: (async (req, res) => {
        try {
            const { bill_id, sale_date, inventory, customer_id, shipping_address, status, adjustment, products, } = req.body;
            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({ message: "Products are required" });
            }
            await index_1.insertSaleSchema.parseAsync({
                bill_id,
                sale_date,
                inventory,
                customer_id,
                shipping_address,
                status,
                adjustment,
            });
            const existingSale = await (0, index_2.findSaleByBillId)(bill_id);
            if (existingSale) {
                return res.status(409).json({
                    message: `The sale with the BILL ID "${bill_id}" already exists. Please choose a different BILL ID.`,
                });
            }
            const customerValidation = await (0, index_2.findCustomerById)(customer_id);
            if (!customerValidation) {
                return res.status(404).json({
                    message: `The customer with ID ${customer_id} was not found. Please verify the customer ID`,
                });
            }
            const inventoryValidation = await (0, index_2.findInventoryByName)(inventory);
            if (!inventoryValidation) {
                return res.status(404).json({
                    message: `The inventory "${inventory}" was not found. Please verify the inventory.`,
                });
            }
            const allSaleProducts = [];
            const newSale = await connection_1.db.transaction(async (tx) => {
                await tx
                    .insert(index_1.sales)
                    .values({
                    bill_id,
                    sale_date: sale_date ? sale_date : new Date().toISOString(),
                    inventory,
                    customer_id,
                    shipping_address,
                    status,
                    adjustment,
                })
                    .returning();
                for (const product of products) {
                    await index_1.insertSaleProductSchema.parseAsync(product);
                    const { product: productName, quantity, unit_price, discount, } = product;
                    const [productQuery] = await tx
                        .select()
                        .from(index_1.inventoryProducts)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ilike)(index_1.inventoryProducts.inventory, inventory), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.product, productName), (0, drizzle_orm_1.gte)(index_1.inventoryProducts.quantity, quantity)))
                        .limit(1);
                    if (!productQuery) {
                        throw new Error(`Product "${productName}" (${quantity} units) not found at inventory "${inventory}". Please check the inventory product and try again.`);
                        tx.rollback();
                    }
                    const parseDiscount = parseFloat(discount) || 0;
                    const productTotalPrice = quantity * unit_price -
                        (quantity * unit_price * parseDiscount) / 100;
                    const [newProduct] = await tx
                        .insert(index_1.saleProducts)
                        .values({
                        mr_id: productQuery.mr_id,
                        inventory,
                        bill_id,
                        product: productName,
                        quantity,
                        unit_price,
                        discount: parseDiscount,
                        total_price: productTotalPrice,
                    })
                        .returning();
                    allSaleProducts.push(newProduct);
                    await tx
                        .update(index_1.inventoryProducts)
                        .set({
                        quantity: (0, drizzle_orm_1.sql) `${index_1.inventoryProducts.quantity} - ${quantity}`,
                        updated_at: new Date().toISOString(),
                    })
                        .where((0, drizzle_orm_1.eq)(index_1.inventoryProducts.id, productQuery.id))
                        .returning();
                }
                const updatedTotalPrice = allSaleProducts.reduce((total, product) => total + parseFloat(product.total_price), 0);
                const [updatedSale] = await tx
                    .update(index_1.sales)
                    .set({
                    total_price: (0, drizzle_orm_1.sql) `${updatedTotalPrice} - ${index_1.sales.adjustment}`,
                    updated_at: new Date().toISOString(),
                })
                    .where((0, drizzle_orm_1.ilike)(index_1.sales.bill_id, bill_id))
                    .returning();
                return updatedSale;
            });
            res.status(201).json({
                message: `The sales BILL ID "${bill_id}" has been created successfully`,
                sale: newSale,
                products: allSaleProducts,
            });
        }
        catch (error) {
            console.error("Error creating sale Bill ID:", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while creating the sale. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveAll: (async (req, res) => {
        try {
            const allSales = await connection_1.db.query.sales.findMany({
                orderBy: [(0, drizzle_orm_1.desc)(index_1.sales.created_at)],
                columns: {
                    customer_id: false,
                },
                with: {
                    customer: true,
                    inventory: false,
                    products: {
                        columns: {
                            id: false,
                            bill_id: false,
                        },
                    },
                    shipments: {
                        columns: {
                            id: false,
                            bill_id: false,
                        },
                    },
                },
            });
            res.status(200).json({
                message: "Sales retrieved successfully.",
                sales: allSales,
            });
        }
        catch (error) {
            console.error("Error retrieving sales:", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving sales. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveByBillId: (async (req, res) => {
        try {
            const { billId } = req.params;
            const sale = await connection_1.db.query.sales.findFirst({
                where: (0, drizzle_orm_1.ilike)(index_1.sales.bill_id, billId),
                orderBy: [(0, drizzle_orm_1.desc)(index_1.sales.created_at)],
                columns: {
                    customer_id: false,
                },
                with: {
                    customer: true,
                    inventory: false,
                    products: {
                        columns: {
                            bill_id: false,
                        },
                    },
                    shipments: {
                        columns: {
                            id: false,
                            bill_id: false,
                        },
                    },
                },
            });
            if (!sale) {
                return res.status(404).json({
                    message: `The sale BILL ID "${billId}" was not found. Please verify the BILL ID and try again.`,
                });
            }
            res.status(200).json({
                message: "Sale retrieved successfully.",
                sale,
            });
        }
        catch (error) {
            console.error("Error retrieving sale", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving the sale. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    updateByBillId: (async (req, res) => {
        try {
            const { billId } = req.params;
            const { bill_id, sale_date, inventory, customer_id, shipping_address, adjustment, status, products, } = req.body;
            await index_1.updateSaleSchema.parseAsync({
                bill_id,
                sale_date,
                inventory,
                customer_id,
                shipping_address,
                adjustment,
                status,
            });
            const parsedAdjustment = parseFloat(adjustment);
            const existingSale = await (0, index_2.findSaleByBillId)(billId);
            if (!existingSale) {
                return res.status(404).json({
                    message: `The sale BILL ID "${billId}" was not found. Please verify the BILL ID.`,
                });
            }
            const { bill_id: existingSaleBillId, sale_date: existingSaleDate, inventory: existingInventory, customer_id: existingSaleCustomerId, shipping_address: existingSaleShippingAddress, adjustment: existingSaleAdjustment, status: existingSaleStatus, } = existingSale;
            if (bill_id && bill_id !== existingSaleBillId) {
                const billIdVerification = await (0, index_2.findSaleByBillId)(bill_id);
                if (billIdVerification) {
                    return res.status(409).json({
                        message: `The sale with the BILL ID "${bill_id}" already exists. Please choose a different BILL ID.`,
                    });
                }
            }
            if (customer_id && customer_id !== existingSaleCustomerId) {
                const customerValidation = await (0, index_2.findCustomerById)(customer_id);
                if (!customerValidation) {
                    return res.status(404).json({
                        message: `The customer ID "${customer_id}" was not found. Please verify the customer ID.`,
                    });
                }
            }
            const updatedData = {
                bill_id: bill_id || existingSaleBillId,
                sale_date: sale_date || existingSaleDate,
                inventory: existingInventory,
                customer_id: customer_id || existingSaleCustomerId,
                shipping_address: shipping_address || existingSaleShippingAddress,
                status: status || existingSaleStatus,
                updated_at: new Date().toISOString(),
            };
            const oldProductTotalPrice = await (0, index_2.calculateSalePrice)(billId);
            let updatedSale;
            const newlySaleProducts = [];
            if (Array.isArray(products) && products.length > 0) {
                updatedSale = await connection_1.db.transaction(async (tx) => {
                    const [updatedSale] = await tx
                        .update(index_1.sales)
                        .set(updatedData)
                        .where((0, drizzle_orm_1.ilike)(index_1.sales.bill_id, billId))
                        .returning();
                    for (const product of products) {
                        await index_1.insertSaleProductSchema.parseAsync(product);
                        const { product: productName, quantity, unit_price, discount, } = product;
                        const [productQuery] = await tx
                            .select()
                            .from(index_1.inventoryProducts)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ilike)(index_1.inventoryProducts.inventory, inventory), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.product, productName), (0, drizzle_orm_1.gte)(index_1.inventoryProducts.quantity, quantity)))
                            .limit(1);
                        if (!productQuery) {
                            throw new Error(`Product "${productName}" (${quantity} units) not found in inventory "${inventory}".`);
                            tx.rollback();
                        }
                        const parsedDiscount = parseFloat(discount) || 0;
                        const productTotalPrice = quantity * unit_price -
                            (quantity * unit_price * parsedDiscount) / 100;
                        const [saleProduct] = await tx
                            .insert(index_1.saleProducts)
                            .values({
                            mr_id: productQuery.mr_id,
                            inventory,
                            bill_id,
                            product: productName,
                            quantity,
                            unit_price,
                            discount: parsedDiscount,
                            total_price: productTotalPrice,
                        })
                            .returning();
                        newlySaleProducts.push(saleProduct);
                        await tx
                            .update(index_1.inventoryProducts)
                            .set({
                            quantity: (0, drizzle_orm_1.sql) `${index_1.inventoryProducts.quantity} - ${quantity}`,
                            updated_at: new Date().toISOString(),
                        })
                            .where((0, drizzle_orm_1.eq)(index_1.inventoryProducts.id, productQuery.id))
                            .returning();
                    }
                    const newlyProductTotalPrice = newlySaleProducts.reduce((total, product) => total + parseFloat(product.total_price), 0);
                    const updatedTotalPrice = oldProductTotalPrice + newlyProductTotalPrice;
                    if (parsedAdjustment &&
                        (parsedAdjustment < 0 || parsedAdjustment > updatedTotalPrice)) {
                        tx.rollback();
                    }
                    const finalAdjustment = parsedAdjustment || parseFloat(existingSaleAdjustment);
                    const finalTotalPrice = updatedTotalPrice - finalAdjustment;
                    const [finalUpdatedSale] = await tx
                        .update(index_1.sales)
                        .set({
                        adjustment: finalAdjustment,
                        total_price: finalTotalPrice,
                        updated_at: new Date().toISOString(),
                    })
                        .where((0, drizzle_orm_1.ilike)(index_1.sales.bill_id, updatedSale.bill_id))
                        .returning();
                    return finalUpdatedSale;
                });
            }
            else {
                if (parsedAdjustment &&
                    (parsedAdjustment < 0 || parsedAdjustment > oldProductTotalPrice)) {
                    return res.status(400).json({
                        message: "Adjustment amount must be between 0 and available total price.",
                    });
                }
                const finalAdjustment = parsedAdjustment || parseFloat(existingSaleAdjustment);
                const finalTotalPrice = oldProductTotalPrice - finalAdjustment;
                [updatedSale] = await connection_1.db
                    .update(index_1.sales)
                    .set({
                    ...updatedData,
                    adjustment: finalAdjustment,
                    total_price: finalTotalPrice,
                })
                    .where((0, drizzle_orm_1.ilike)(index_1.sales.bill_id, billId))
                    .returning();
                if (!updatedSale) {
                    return res.status(404).json({
                        message: `An error occurred while updating the sale BILL ID "${billId}".`,
                    });
                }
            }
            res.status(200).json({
                message: `The sale BILL ID "${billId}" has been updated successfully.`,
                sale: updatedSale,
                products: newlySaleProducts || [],
            });
        }
        catch (error) {
            console.error("Error updating sale by bill ID:", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while updating the sale. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    deleteByBillId: (async (req, res) => {
        try {
            const { billId } = req.params;
            const [existingSale] = await connection_1.db.query.sales.findMany({
                where: (0, drizzle_orm_1.ilike)(index_1.sales.bill_id, billId),
                with: {
                    products: true,
                },
            });
            if (!existingSale) {
                return res.status(404).json({
                    message: `The sale BILL ID "${billId}" was not found. Please verify the BILL ID.`,
                });
            }
            if (existingSale.products.length > 0) {
                await connection_1.db.transaction(async (tx) => {
                    for (const product of existingSale.products) {
                        await tx
                            .update(index_1.inventoryProducts)
                            .set({
                            quantity: (0, drizzle_orm_1.sql) `${index_1.inventoryProducts.quantity} + ${product.quantity}`,
                            updated_at: new Date().toISOString(),
                        })
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ilike)(index_1.inventoryProducts.inventory, existingSale.inventory), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.mr_id, product.mr_id), (0, drizzle_orm_1.ilike)(index_1.inventoryProducts.product, product.product)));
                    }
                    await tx.delete(index_1.sales).where((0, drizzle_orm_1.ilike)(index_1.sales.bill_id, billId));
                });
            }
            else {
                await connection_1.db.delete(index_1.sales).where((0, drizzle_orm_1.ilike)(index_1.sales.bill_id, billId));
            }
            res.status(200).json({
                message: `The sale BILL ID "${billId}" has been deleted successfully`,
                sales: existingSale,
            });
        }
        catch (error) {
            console.error("Error deleting sale by bill ID:", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while deleting the sale. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
};
