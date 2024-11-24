import { ilike, and, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "../database/connection.js";
import {
  insertPurchaseSchema,
  insertPurchaseProductSchema,
  inventoryProducts,
  purchases,
  purchaseProducts,
  updatePurchaseSchema,
} from "../schemas/index.js";
import {
  calculatePurchasePrice,
  findInventoryByName,
  findProductByName,
  findPurchaseByMrId,
  findVendorByName,
} from "../services/index.js";

export const purchasesController = {
  create: async (req, res) => {
    try {
      const { mr_id, purchase_date, vendor, inventory, adjustment, products } =
        req.body;

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "Products are required" });
      }

      await insertPurchaseSchema.parseAsync({
        mr_id,
        purchase_date,
        vendor,
        inventory,
        adjustment,
      });

      const existingPurchase = await findPurchaseByMrId(mr_id);
      if (existingPurchase) {
        return res.status(409).json({
          message: `The purchase with the MR ID "${mr_id}" already exists. Please choose a different MR ID.`,
        });
      }

      const vendorValidation = await findVendorByName(vendor);
      if (!vendorValidation) {
        return res.status(404).json({
          message: `The vendor "${vendor}" was not found. Please verify the vendor.`,
        });
      }

      const inventoryValidation = await findInventoryByName(inventory);
      if (!inventoryValidation) {
        return res.status(404).json({
          message: `The inventory "${inventory}" was not found. Please verify the inventory.`,
        });
      }

      const productErrors = [];
      await Promise.all(
        products.map(async (product) => {
          await insertPurchaseProductSchema.parseAsync(product);

          const productVerification = await findProductByName(product.product);
          if (!productVerification) {
            productErrors.push(
              `The product ${product.product} was not found. Please verify the product`
            );
            return null;
          }
          return product;
        })
      );
      if (productErrors.length > 0) {
        return res.status(404).json({ message: productErrors });
      }

      const allPurchaseProducts = [];
      const newPurchase = await db.transaction(async (tx) => {
        await tx
          .insert(purchases)
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
          const {
            product: productName,
            quantity,
            unit_price,
            discount,
          } = product;

          const parseDiscount = parseFloat(discount) || 0;

          const productTotalPrice =
            quantity * unit_price -
            (quantity * unit_price * parseDiscount) / 100;

          const [purchaseProduct] = await tx
            .insert(purchaseProducts)
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
            .insert(inventoryProducts)
            .values({
              mr_id,
              inventory,
              product: productName,
              quantity,
            })
            .returning();
        }

        const updatedTotalPrice = allPurchaseProducts.reduce(
          (total, product) => total + parseFloat(product.total_price),
          0
        );

        const [updatedpurchase] = await tx
          .update(purchases)
          .set({
            total_price: sql`${updatedTotalPrice} - ${purchases.adjustment}`,
            updated_at: new Date().toISOString(),
          })
          .where(ilike(purchases.mr_id, mr_id))
          .returning();

        return updatedpurchase;
      });

      res.status(201).json({
        message: `The purchase MR ID "${mr_id}" has been created successfully`,
        purchase: newPurchase,
        products: allPurchaseProducts,
      });
    } catch (error) {
      console.error("An error occurred while creating purchase", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while creating the purchase. Please try again.",
        error: error.message,
      });
    }
  },
  retrieveAll: async (req, res) => {
    try {
      const allPurchases = await db.query.purchases.findMany({
        orderBy: [desc(purchases.created_at)],
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
    } catch (error) {
      console.error("An error occurred while retrieving purchases", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving purchases. Please try again.",
        error: error.message,
      });
    }
  },
  retrieveByMrId: async (req, res) => {
    try {
      const { mrId } = req.params;
      const purchase = await db.query.purchases.findFirst({
        where: ilike(purchases.mr_id, mrId),
        orderBy: [desc(purchases.created_at)],
        with: {
          vendor: false,
          inventory: false,
          products: {
            columns: {
              // id: false,
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
    } catch (error) {
      console.error("An error occurred while retrieving purchase", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving the purchase. Please try again.",
        error: error.message,
      });
    }
  },
  updateByMrId: async (req, res) => {
    try {
      const { mrId } = req.params;
      const {
        mr_id: mrIdBody,
        purchase_date: purchaseDate,
        vendor,
        inventory,
        adjustment,
        products,
      } = req.body;

      // Schema validation
      await updatePurchaseSchema.parseAsync({
        mr_id: mrIdBody,
        purchase_date: purchaseDate,
        vendor,
        inventory,
        adjustment,
      });

      const parsedAdjustment = parseFloat(adjustment);

      // Find existing purchase
      const existingPurchase = await findPurchaseByMrId(mrId);

      if (!existingPurchase) {
        return res.status(404).json({
          message: `The purchase MR ID "${mrId}" was not found. Please verify the MR ID.`,
        });
      }

      const {
        mr_id: existingMrId,
        purchase_date: existingPurchaseDate,
        vendor: existingVendor,
        inventory: existingInventory,
        adjustment: existingAdjustment,
        total_price: existingTotalPrice,
      } = existingPurchase;

      // MR ID validation
      if (mrIdBody && mrIdBody !== existingMrId) {
        const mrIdVerification = await findPurchaseByMrId(mrIdBody);
        if (mrIdVerification) {
          return res.status(409).json({
            message: `The purchase with the MR ID "${mrIdBody}" already exists. Please choose a different MR ID.`,
          });
        }
      }

      // Vendor validation
      if (vendor && vendor !== existingVendor) {
        const vendorValidation = await findVendorByName(vendor);
        if (!vendorValidation) {
          return res.status(404).json({
            message: `The vendor "${vendor}" was not found. Please verify the vendor.`,
          });
        }
      }

      // Inventory validation
      if (inventory && inventory !== existingInventory) {
        const inventoryValidation = await findInventoryByName(inventory);
        if (!inventoryValidation) {
          return res.status(404).json({
            message: `The inventory "${inventory}" was not found. Please verify the inventory.`,
          });
        }
      }

      // Product validation
      if (Array.isArray(products) && products.length > 0) {
        const productErrors = [];
        await Promise.all(
          products.map(async (product) => {
            await insertPurchaseProductSchema.parseAsync(product);
            const productVerification = await findProductByName(
              product.product
            );
            if (!productVerification) {
              productErrors.push(
                `The product ${product.product} was not found. Please verify the product`
              );
            }
          })
        );
        if (productErrors.length > 0) {
          return res.status(404).json({ message: productErrors });
        }
      }

      // Prepare updated data
      const updatedData = {
        mr_id: mrIdBody || existingMrId,
        purchase_date: purchaseDate || existingPurchaseDate,
        vendor: vendor || existingVendor,
        inventory: inventory || existingInventory,
        updated_at: new Date().toISOString(),
      };

      // Calculate old product total price
      const oldProductTotalPrice = await calculatePurchasePrice(mrId);

      let updatedPurchase;
      const newlyPurchaseProducts = [];

      if (Array.isArray(products) && products.length > 0) {
        updatedPurchase = await db.transaction(async (tx) => {
          const [updatedPurchase] = await tx
            .update(purchases)
            .set(updatedData)
            .where(ilike(purchases.mr_id, mrId))
            .returning();

          for (const product of products) {
            const {
              product: productName,
              quantity,
              unit_price: unitPrice,
              discount,
            } = product;
            const parsedDiscount = parseFloat(discount) || 0;

            const productTotalPrice =
              quantity * unitPrice -
              (quantity * unitPrice * parsedDiscount) / 100;

            const [purchaseProduct] = await tx
              .insert(purchaseProducts)
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
              .insert(inventoryProducts)
              .values({
                mr_id: updatedPurchase.mr_id,
                inventory: updatedPurchase.inventory,
                product: productName,
                quantity,
              })
              .returning();
          }

          const newlyProductTotalPrice = newlyPurchaseProducts.reduce(
            (total, product) => total + parseFloat(product.total_price),
            0
          );

          const updatedTotalPrice =
            oldProductTotalPrice + newlyProductTotalPrice;

          if (
            parsedAdjustment &&
            (parsedAdjustment < 0 || parsedAdjustment > updatedTotalPrice)
          ) {
            tx.rollback();
          }

          const finalAdjustment =
            parsedAdjustment || parseFloat(existingAdjustment);

          const finalTotalPrice = updatedTotalPrice - finalAdjustment;

          const [finalUpdatedPurchase] = await tx
            .update(purchases)
            .set({
              adjustment: finalAdjustment,
              total_price: finalTotalPrice,
              updated_at: new Date().toISOString(),
            })
            .where(ilike(purchases.mr_id, updatedPurchase.mr_id))
            .returning();

          return finalUpdatedPurchase;
        });
      } else {
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
          parsedAdjustment || parseFloat(existingAdjustment);
        const finalTotalPrice = oldProductTotalPrice - finalAdjustment;

        [updatedPurchase] = await db
          .update(purchases)
          .set({
            ...updatedData,
            adjustment: finalAdjustment,
            total_price: finalTotalPrice,
            updated_at: new Date().toISOString(),
          })
          .where(ilike(purchases.mr_id, mrId))
          .returning();

        if (!updatedPurchase) {
          return res.status(404).json({
            message: `An error occurred while updating the purchase MR ID "${mrId}". Please try again.`,
          });
        }

        await db
          .update(inventoryProducts)
          .set({
            inventory: updatedPurchase.inventory,
            updated_at: new Date().toISOString(),
          })
          .where(ilike(inventoryProducts.mr_id, mrId))
          .returning();
      }

      res.status(200).json({
        message: `The purchase MR ID "${mrId}" has been updated successfully`,
        purchase: updatedPurchase,
        products: newlyPurchaseProducts || [],
      });
    } catch (error) {
      console.error("An error occurred while updating purchase:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while updating the purchase. Please try again.",
        error: error.message,
      });
    }
  },
  deleteByMrId: async (req, res) => {
    try {
      const { mrId } = req.params;

      const [existingPurchase] = await db
        .select()
        .from(purchases)
        .where(ilike(purchases.mr_id, mrId))
        .limit(1);

      if (!existingPurchase) {
        return res.status(404).json({
          message: `The purchase with MR ID "${mrId}" was not found. Please verify the MR ID.`,
        });
      }

      const { inventory: existingInventory } = existingPurchase;

      await db.transaction(async (tx) => {
        await tx
          .delete(inventoryProducts)
          .where(
            and(
              ilike(inventoryProducts.inventory, existingInventory),
              ilike(inventoryProducts.mr_id, mrId)
            )
          );

        const [deletedPurchase] = await tx
          .delete(purchases)
          .where(ilike(purchases.mr_id, mrId))
          .returning();

        if (!deletedPurchase) {
          throw new Error(
            `The purchase with MR ID "${mrId}" could not be deleted.`
          );
          tx.rollback();
        }
      });

      res.status(200).json({
        message: `The purchase with MR ID "${mrId}" has been deleted successfully.`,
      });
    } catch (error) {
      console.error(
        "An error occurred while deleting purchase by MR ID",
        error
      );
      res.status(500).json({
        message:
          "An unexpected error occurred while deleting the purchase. Please try again.",
        error: error.message,
      });
    }
  },
};
