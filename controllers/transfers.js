import { and, eq, gte, ilike, sql , desc} from "drizzle-orm";
import { z } from "zod";
import { db } from "../database/connection.js";
import {
  insertTransferProductSchema,
  insertTransferSchema,
  inventoryProducts,
  transferProducts,
  transfers,
  updateTransferSchema,
} from "../schemas/index.js";
import { findInventoryByName, findTransferByTrfId } from "../services/index.js";

export const transfersController = {
  create: async (req, res) => {
    try {
      const {
        trf_id,
        transfer_date,
        source_inventory,
        destination_inventory,
        products,
      } = req.body;

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "Products are required" });
      }

      await insertTransferSchema.parseAsync({
        trf_id,
        transfer_date,
        source_inventory,
        destination_inventory,
      });

      const existingTransfer = await findTransferByTrfId(trf_id);
      if (existingTransfer) {
        return res.status(409).json({
          message: `The transfer with the TRF ID "${trf_id}" already exists. Please choose a different TRF ID.`,
        });
      }

      const verifySourceInventory = await findInventoryByName(source_inventory);
      if (!verifySourceInventory) {
        return res.status(404).json({
          message: `Source inventory "${source_inventory}" not found. Please check source inventory.`,
        });
      }

      const verifyDestinationInventory = await findInventoryByName(
        destination_inventory
      );
      if (!verifyDestinationInventory) {
        return res.status(404).json({
          message: `Destination inventory "${destination_inventory}" not found. Please check destination inventory.`,
        });
      }

      let newTransfer;
      let allTransferProducts = [];
      await db.transaction(async (tx) => {
        [newTransfer] = await tx
          .insert(transfers)
          .values({
            trf_id,
            transfer_date: transfer_date
              ? transfer_date
              : new Date().toISOString(),
            source_inventory,
            destination_inventory,
          })
          .returning();

        for (const product of products) {
          await insertTransferProductSchema.parseAsync(product);
          const { mr_id, product: productName, quantity } = product;

          const [sourceInventoryProductQuery] = await tx
            .select()
            .from(inventoryProducts)
            .where(
              and(
                ilike(inventoryProducts.inventory, source_inventory),
                ilike(inventoryProducts.mr_id, mr_id),
                ilike(inventoryProducts.product, productName),
                gte(inventoryProducts.quantity, quantity)
              )
            )
            .limit(1);

          if (!sourceInventoryProductQuery) {
            throw new Error(
              `Product "${productName}" (${quantity} units) for MR "${mr_id}" not found in inventory "${source_inventory}". Please check inventory products.`
            );
            tx.rollback();
          }

          const [destinationInventoryProductQuery] = await tx
            .select()
            .from(inventoryProducts)
            .where(
              and(
                ilike(inventoryProducts.inventory, destination_inventory),
                ilike(inventoryProducts.mr_id, mr_id),
                ilike(inventoryProducts.product, productName)
              )
            )
            .limit(1);

          await tx
            .update(inventoryProducts)
            .set({
              quantity: sql`${inventoryProducts.quantity} - ${quantity}`,
              updated_at: new Date().toISOString(),
            })
            .where(eq(inventoryProducts.id, sourceInventoryProductQuery.id))
            .returning();

          if (destinationInventoryProductQuery) {
            await tx
              .update(inventoryProducts)
              .set({
                quantity: sql`${inventoryProducts.quantity} + ${quantity}`,
                updated_at: new Date().toISOString(),
              })
              .where(
                eq(inventoryProducts.id, destinationInventoryProductQuery.id)
              )
              .returning();
          } else {
            await tx
              .insert(inventoryProducts)
              .values({
                mr_id,
                inventory: destination_inventory,
                product: productName,
                quantity,
              })
              .returning();
          }

          const [newTransferProduct] = await tx
            .insert(transferProducts)
            .values({
              trf_id,
              mr_id,
              product: productName,
              quantity,
            })
            .returning();
          allTransferProducts.push(newTransferProduct);
        }
      });

      res.status(201).json({
        message: "Transfer created successfully",
        transfer: newTransfer,
        transferProducts: allTransferProducts,
      });
    } catch (error) {
      console.error(
        "An error occurred while creating transfer product between inventories",
        error
      );

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while creating transfer product between inventories. Please try again.",
        error: error.message,
      });
    }
  },
  retrieveAll: async (req, res) => {
    try {
      const allTransfers = await db.query.transfers.findMany({
        orderBy: [desc(transfers.created_at)],
        with: {
          products: false,
          source: false,
          destination: false,
        },
      });

      res.status(200).json({
        message:
          "All inventories with associated transfers retrieved successfully",
        transfers: allTransfers,
      });
    } catch (error) {
      console.error(
        "An error occurred while retrieving all inventories with associated transfers",
        error
      );
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving All inventories with associated transfers. Please try again.",
        error: error.message,
      });
    }
  },
  retrieveByTrfId: async (req, res) => {
    try {
      const { trfId } = req.params;
      const transfer = await db.query.transfers.findFirst({
        where: ilike(transfers.trf_id, trfId),
        orderBy: [desc(transfers.created_at)],
        with: {
          products: true,
          source: false,
          destination: false,
        },
      });
      if (!transfer) {
        return res.status(404).json({
          message: `Inventory with associated transfer not found with the provided ID "${trfId}". Please verify the ID.`,
        });
      }
      res.status(200).json({
        message: "Inventory with associated transfer retrieved successfully",
        transfer,
      });
    } catch (error) {
      console.error(
        "An error occurred while retrieving inventory transfer",
        error
      );
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving inventory transfer. Please try again.",
        error: error.message,
      });
    }
  },
  updateByTrfId: async (req, res) => {
    try {
      const { trfId } = req.params;
      const { trf_id, transfer_date, products } = req.body;
      await updateTransferSchema.parseAsync({
        trf_id,
        transfer_date,
      });

      const existingTransfer = await findTransferByTrfId(trfId);
      if (!existingTransfer) {
        return res.status(404).json({
          message: `Inventory with associated transfer not found with the provided ID "${trfId}". Please verify the ID.`,
        });
      }

      const {
        trf_id: existingTrfId,
        transfer_date: existingTransferDate,
        source_inventory: existingSourceInventory,
        destination_inventory: existingDestinationInventory,
      } = existingTransfer;

      if (trf_id && trf_id !== trfId) {
        const existingTransfer = await findTransferByTrfId(trf_id);
        if (existingTransfer) {
          return res.status(409).json({
            message: `Inventory transfer with ID "${trf_id}" already exists. Please choose a different ID.`,
          });
        }
      }

      const updateData = {
        trf_id: trf_id || existingTrfId,
        transfer_date: transfer_date || existingTransferDate,
        source_inventory: existingSourceInventory,
        destination_inventory: existingDestinationInventory,
        updated_at: new Date().toISOString(),
      };

      let updatedTransfer;
      const newlyTransferProducts = [];

      if (Array.isArray(products) && products.length > 0) {
        updatedTransfer = await db.transaction(async (tx) => {
          const [updatedTransfer] = await tx
            .update(transfers)
            .set(updateData)
            .where(ilike(transfers.trf_id, trfId))
            .returning();

          for (const product of products) {
            await insertTransferProductSchema.parseAsync(product);
            const { mr_id, product: productName, quantity } = product;

            const [sourceInventoryProductQuery] = await tx
              .select()
              .from(inventoryProducts)
              .where(
                and(
                  ilike(
                    inventoryProducts.inventory,
                    updatedTransfer.source_inventory
                  ),
                  ilike(inventoryProducts.mr_id, mr_id),
                  ilike(inventoryProducts.product, productName),
                  gte(inventoryProducts.quantity, quantity)
                )
              )
              .limit(1);

            if (!sourceInventoryProductQuery) {
              throw new Error(
                `Product "${productName}" (${quantity} units) for MR "${mr_id}" not found in inventory "${source_inventory}". Please check inventory products.`
              );
              tx.rollback();
            }

            const [destinationInventoryProductQuery] = await tx
              .select()
              .from(inventoryProducts)
              .where(
                and(
                  ilike(
                    inventoryProducts.inventory,
                    updatedTransfer.destination_inventory
                  ),
                  ilike(inventoryProducts.mr_id, mr_id),
                  ilike(inventoryProducts.product, productName)
                )
              )
              .limit(1);

            await tx
              .update(inventoryProducts)
              .set({
                quantity: sql`${inventoryProducts.quantity} - ${quantity}`,
                updated_at: new Date().toISOString(),
              })
              .where(eq(inventoryProducts.id, sourceInventoryProductQuery.id))
              .returning();

            if (destinationInventoryProductQuery) {
              await tx
                .update(inventoryProducts)
                .set({
                  quantity: sql`${inventoryProducts.quantity} + ${quantity}`,
                  updated_at: new Date().toISOString(),
                })
                .where(
                  eq(inventoryProducts.id, destinationInventoryProductQuery.id)
                )
                .returning();
            } else {
              await tx
                .insert(inventoryProducts)
                .values({
                  mr_id,
                  inventory: updatedTransfer.destination_inventory,
                  product: productName,
                  quantity,
                })
                .returning();
            }

            const [newTransferProduct] = await tx
              .insert(transferProducts)
              .values({
                trf_id: updatedTransfer.trf_id,
                mr_id,
                product: productName,
                quantity,
              })
              .returning();
            newlyTransferProducts.push(newTransferProduct);
          }

          return updatedTransfer;
        });
      } else {
        [updatedTransfer] = await db
          .update(transfers)
          .set(updateData)
          .where(ilike(transfers.trf_id, trfId))
          .returning();
      }

      res.status(200).json({
        message: "Inventory transfer updated successfully",
        transfer: updatedTransfer,
      });
    } catch (error) {
      console.error(
        "An error occurred while updating inventory transfer",
        error
      );
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while updating inventory transfer. Please try again.",
        error: error.message,
      });
    }
  },
  deleteByTrfId: async (req, res) => {
    try {
      const { trfId } = req.params;

      const [existingTransfer] = await db
        .select()
        .from(transfers)
        .where(ilike(transfers.trf_id, trfId))
        .limit(1);
      if (!existingTransfer) {
        return res.status(404).json({
          message: `Inventory with associated transfer not found with the provided ID "${trfId}". Please verify the ID.`,
        });
      }
      const {
        trf_id: existingTransferTrfId,
        source_inventory: existingTransferSourceInventory,
        destination_inventory: existingTransferDestinationInventory,
      } = existingTransfer;

      let deletedTransfer;
      await db.transaction(async (tx) => {
        const allTransferProducts = await tx
          .delete(transferProducts)
          .where(ilike(transferProducts.trf_id, existingTransferTrfId))
          .returning();

        for (const product of allTransferProducts) {
          const [destinationInventoryProduct] = await tx
            .select()
            .from(inventoryProducts)
            .where(
              and(
                ilike(inventoryProducts.mr_id, product.mr_id),
                ilike(inventoryProducts.product, product.product),
                ilike(
                  inventoryProducts.inventory,
                  existingTransferDestinationInventory
                )
              )
            )
            .limit(1);

          const { quantity: availableQuantity } = destinationInventoryProduct;

          await tx
            .update(inventoryProducts)
            .set({
              quantity: sql`${inventoryProducts.quantity} + ${availableQuantity}`,
              updated_at: new Date().toISOString(),
            })
            .where(
              and(
                ilike(
                  inventoryProducts.inventory,
                  existingTransferSourceInventory
                ),
                ilike(inventoryProducts.product, product.product),
                ilike(inventoryProducts.mr_id, product.mr_id)
              )
            )
            .returning();

          await tx
            .delete(inventoryProducts)
            .where(
              and(
                ilike(
                  inventoryProducts.inventory,
                  existingTransferDestinationInventory
                ),
                ilike(inventoryProducts.product, product.product),
                ilike(inventoryProducts.mr_id, product.mr_id)
              )
            )
            .returning();
        }
        [deletedTransfer] = await tx
          .delete(transfers)
          .where(ilike(transfers.trf_id, trfId))
          .returning();
      });
      res.status(200).json({
        message: "Inventory transfer deleted successfully",
      });
    } catch (error) {
      console.error(
        "An error occurred while deleting inventory transfer by Trf Id",
        error
      );
      res.status(500).json({
        message:
          "An unexpected error occurred while deleting the inventory transfer. Please try again.",
        error: error.message,
      });
    }
  },
};
