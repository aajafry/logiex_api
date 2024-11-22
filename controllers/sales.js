import { and, eq, gte, ilike, sql, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "../database/connection.js";
import {
  insertSaleProductSchema,
  insertSaleSchema,
  inventoryProducts,
  saleProducts,
  sales,
  updateSaleSchema,
} from "../schemas/index.js";
import {
  calculateSalePrice,
  findCustomerById,
  findInventoryByName,
  findSaleByBillId,
} from "../services/index.js";

export const salesController = {
  create: async (req, res) => {
    try {
      const {
        bill_id,
        sale_date,
        inventory,
        customer_id,
        shipping_address,
        status,
        adjustment,
        products,
      } = req.body;

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "Products are required" });
      }

      await insertSaleSchema.parseAsync({
        bill_id,
        sale_date,
        inventory,
        customer_id,
        shipping_address,
        status,
        adjustment,
      });

      const existingSale = await findSaleByBillId(bill_id);
      if (existingSale) {
        return res.status(409).json({
          message: `The sale with the BILL ID "${bill_id}" already exists. Please choose a different BILL ID.`,
        });
      }

      const customerValidation = await findCustomerById(customer_id);
      if (!customerValidation) {
        return res.status(404).json({
          message: `The customer with ID ${customer_id} was not found. Please verify the customer ID`,
        });
      }

      const inventoryValidation = await findInventoryByName(inventory);
      if (!inventoryValidation) {
        return res.status(404).json({
          message: `The inventory "${inventory}" was not found. Please verify the inventory.`,
        });
      }

      const allSaleProducts = [];
      const newSale = await db.transaction(async (tx) => {
        await tx
          .insert(sales)
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
          await insertSaleProductSchema.parseAsync(product);
          const {
            product: productName,
            quantity,
            unit_price,
            discount,
          } = product;

          const [productQuery] = await tx
            .select()
            .from(inventoryProducts)
            .where(
              and(
                ilike(inventoryProducts.inventory, inventory),
                ilike(inventoryProducts.product, productName),
                gte(inventoryProducts.quantity, quantity)
              )
            )
            .limit(1);

          if (!productQuery) {
            throw new Error(
              `Product "${productName}" (${quantity} units) not found at inventory "${inventory}". Please check the inventory product and try again.`
            );
            tx.rollback();
          }

          const parseDiscount = parseFloat(discount) || 0;

          const productTotalPrice =
            quantity * unit_price -
            (quantity * unit_price * parseDiscount) / 100;

          const [newProduct] = await tx
            .insert(saleProducts)
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
            .update(inventoryProducts)
            .set({
              quantity: sql`${inventoryProducts.quantity} - ${quantity}`,
              updated_at: new Date().toISOString(),
            })
            .where(eq(inventoryProducts.id, productQuery.id))
            .returning();
        }

        const updatedTotalPrice = allSaleProducts.reduce(
          (total, product) => total + parseFloat(product.total_price),
          0
        );

        const [updatedSale] = await tx
          .update(sales)
          .set({
            total_price: sql`${updatedTotalPrice} - ${sales.adjustment}`,
            updated_at: new Date().toISOString(),
          })
          .where(ilike(sales.bill_id, bill_id))
          .returning();

        return updatedSale;
      });

      res.status(201).json({
        message: `The sales BILL ID "${bill_id}" has been created successfully`,
        sale: newSale,
        products: allSaleProducts,
      });
    } catch (error) {
      console.error("Error creating sale Bill ID:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while creating the sale. Please try again.",
        error: error.message,
      });
    }
  },
  retrieveAll: async (req, res) => {
    try {
      const allSales = await db.query.sales.findMany({
        orderBy: [desc(sales.created_at)],
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
    } catch (error) {
      console.error("Error retrieving sales:", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving sales. Please try again.",
        error: error.message,
      });
    }
  },
  retrieveByBillId: async (req, res) => {
    try {
      const { billId } = req.params;
      const sale = await db.query.sales.findFirst({
        where: ilike(sales.bill_id, billId),
        orderBy: [desc(sales.created_at)],
        columns: {
          customer_id: false,
        },
        with: {
          customer: true,
          inventory: false,
          products: {
            columns: {
              // id: false,
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
    } catch (error) {
      console.error("Error retrieving sale", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving the sale. Please try again.",
        error: error.message,
      });
    }
  },
  updateByBillId: async (req, res) => {
    try {
      const { billId } = req.params;
      const {
        bill_id,
        sale_date,
        inventory,
        customer_id,
        shipping_address,
        adjustment,
        status,
        products,
      } = req.body;

      // Validate input schema
      await updateSaleSchema.parseAsync({
        bill_id,
        sale_date,
        inventory,
        customer_id,
        shipping_address,
        adjustment,
        status,
      });

      const parsedAdjustment = parseFloat(adjustment);

      // Retrieve the existing sale
      const existingSale = await findSaleByBillId(billId);
      if (!existingSale) {
        return res.status(404).json({
          message: `The sale BILL ID "${billId}" was not found. Please verify the BILL ID.`,
        });
      }

      const {
        bill_id: existingSaleBillId,
        sale_date: existingSaleDate,
        inventory: existingInventory,
        customer_id: existingSaleCustomerId,
        shipping_address: existingSaleShippingAddress,
        adjustment: existingSaleAdjustment,
        status: existingSaleStatus,
      } = existingSale;

      // Validate new bill_id for uniqueness
      if (bill_id && bill_id !== existingSaleBillId) {
        const billIdVerification = await findSaleByBillId(bill_id);
        if (billIdVerification) {
          return res.status(409).json({
            message: `The sale with the BILL ID "${bill_id}" already exists. Please choose a different BILL ID.`,
          });
        }
      }

      // Validate customer ID
      if (customer_id && customer_id !== existingSaleCustomerId) {
        const customerValidation = await findCustomerById(customer_id);
        if (!customerValidation) {
          return res.status(404).json({
            message: `The customer ID "${customer_id}" was not found. Please verify the customer ID.`,
          });
        }
      }

      // Prepare updated data for the sale
      const updatedData = {
        bill_id: bill_id || existingSaleBillId,
        sale_date: sale_date || existingSaleDate,
        inventory: existingInventory,
        customer_id: customer_id || existingSaleCustomerId,
        shipping_address: shipping_address || existingSaleShippingAddress,
        status: status || existingSaleStatus,
        updated_at: new Date().toISOString(),
      };

      // Calculate the old product total price
      const oldProductTotalPrice = await calculateSalePrice(billId);

      let updatedSale;
      const newlySaleProducts = [];

      if (Array.isArray(products) && products.length > 0) {
        updatedSale = await db.transaction(async (tx) => {
          // Update sale details
          const [updatedSale] = await tx
            .update(sales)
            .set(updatedData)
            .where(ilike(sales.bill_id, billId))
            .returning();

          for (const product of products) {
            await insertSaleProductSchema.parseAsync(product);

            const {
              product: productName,
              quantity,
              unit_price,
              discount,
            } = product;

            const [productQuery] = await tx
              .select()
              .from(inventoryProducts)
              .where(
                and(
                  ilike(inventoryProducts.inventory, inventory),
                  ilike(inventoryProducts.product, productName),
                  gte(inventoryProducts.quantity, quantity)
                )
              )
              .limit(1);

            if (!productQuery) {
              throw new Error(
                `Product "${productName}" (${quantity} units) not found in inventory "${inventory}".`
              );
              tx.rollback();
            }

            const parsedDiscount = parseFloat(discount) || 0;
            const productTotalPrice =
              quantity * unit_price -
              (quantity * unit_price * parsedDiscount) / 100;

            // Insert sale product
            const [saleProduct] = await tx
              .insert(saleProducts)
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

            // Update inventory product quantity
            await tx
              .update(inventoryProducts)
              .set({
                quantity: sql`${inventoryProducts.quantity} - ${quantity}`,
                updated_at: new Date().toISOString(),
              })
              .where(eq(inventoryProducts.id, productQuery.id))
              .returning();
          }

          // Calculate the total price
          const newlyProductTotalPrice = newlySaleProducts.reduce(
            (total, product) => total + parseFloat(product.total_price),
            0
          );

          const updatedTotalPrice =
            oldProductTotalPrice + newlyProductTotalPrice;

          // Validate adjustment
          if (
            parsedAdjustment &&
            (parsedAdjustment < 0 || parsedAdjustment > updatedTotalPrice)
          ) {
            tx.rollback();
          }

          const finalAdjustment =
            parsedAdjustment || parseFloat(existingSaleAdjustment);
          const finalTotalPrice = updatedTotalPrice - finalAdjustment;

          // Update the sale with final adjustments
          const [finalUpdatedSale] = await tx
            .update(sales)
            .set({
              adjustment: finalAdjustment,
              total_price: finalTotalPrice,
              updated_at: new Date().toISOString(),
            })
            .where(ilike(sales.bill_id, updatedSale.bill_id))
            .returning();

          return finalUpdatedSale;
        });
      } else {
        // Handle cases with no products
        if (
          parsedAdjustment &&
          (parsedAdjustment < 0 || parsedAdjustment > oldProductTotalPrice)
        ) {
          return res.status(400).json({
            message:
              "Adjustment amount must be between 0 and available total price.",
          });
        }

        const finalAdjustment =
          parsedAdjustment || parseFloat(existingSaleAdjustment);
        const finalTotalPrice = oldProductTotalPrice - finalAdjustment;

        [updatedSale] = await db
          .update(sales)
          .set({
            ...updatedData,
            adjustment: finalAdjustment,
            total_price: finalTotalPrice,
          })
          .where(ilike(sales.bill_id, billId))
          .returning();

        if (!updatedSale) {
          return res.status(404).json({
            message: `An error occurred while updating the sale BILL ID "${billId}".`,
          });
        }
      }

      // Send response
      res.status(200).json({
        message: `The sale BILL ID "${billId}" has been updated successfully.`,
        sale: updatedSale,
        products: newlySaleProducts || [],
      });
    } catch (error) {
      console.error("Error updating sale by bill ID:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while updating the sale. Please try again.",
        error: error.message,
      });
    }
  },
  deleteByBillId: async (req, res) => {
    try {
      const { billId } = req.params;

      const [existingSale] = await db.query.sales.findMany({
        where: ilike(sales.bill_id, billId),
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
        await db.transaction(async (tx) => {
          for (const product of existingSale.products) {
            await tx
              .update(inventoryProducts)
              .set({
                quantity: sql`${inventoryProducts.quantity} + ${product.quantity}`,
                updated_at: new Date().toISOString(),
              })
              .where(
                and(
                  ilike(inventoryProducts.inventory, existingSale.inventory),
                  ilike(inventoryProducts.mr_id, product.mr_id),
                  ilike(inventoryProducts.product, product.product)
                )
              );
          }
          await tx.delete(sales).where(ilike(sales.bill_id, billId));
        });
      } else {
        await db.delete(sales).where(ilike(sales.bill_id, billId));
      }

      res.status(200).json({
        message: `The sale BILL ID "${billId}" has been deleted successfully`,
        sales: existingSale,
      });
    } catch (error) {
      console.error("Error deleting sale by bill ID:", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while deleting the sale. Please try again.",
        error: error.message,
      });
    }
  },
};
