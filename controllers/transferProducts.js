import { and, eq, gte, ilike, sql, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "../database/connection.js";
import {
  transfers,
  transferProducts,
  inventoryProducts,
  updateTransferProductSchema,
} from "../schemas/index.js";
import { findTransferByTrfId } from "../services/index.js";

export const transferProductsController = {
  retrieveAll: async (req, res) => {
    try {
      const allTransferProducts = await db.query.transferProducts.findMany({
        orderBy: [desc(transferProducts.created_at)],
        with: {
          transfer: false,
          product: false,
        },
      });

      res.status(200).json({
        message: "Transfer products retrieved successfully",
        records: allTransferProducts,
      });
    } catch (error) {
      console.error(
        "An error occurred while retrieving transfer products",
        error
      );
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving transfer products. Please try again.",
        error: error.message,
      });
    }
  },
  retrieveById: async (req, res) => {
    try {
      const { id } = req.params;
      const transferProduct = await db.query.transferProducts.findFirst({
        where: eq(transferProducts.id, id),
        orderBy: [desc(transferProducts.created_at)],
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
    } catch (error) {
      console.error(
        "An error occurred while retrieving transfer product",
        error
      );
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving the transfer product. Please try again.",
        error: error.message,
      });
    }
  },
  updateById: async (req, res) => {
    try {
      await updateTransferProductSchema.parseAsync(req.body);
      const { id } = req.params;
      const { quantity: newQuantity } = req.body;

      const [existingTransferProduct] = await db
        .select()
        .from(transferProducts)
        .where(eq(transferProducts.id, id))
        .limit(1);

      if (!existingTransferProduct) {
        return res.status(404).json({
          message: `The transfer product ID ${id} was not found. Please verify the ID and try again.`,
        });
      }

      const {
        trf_id: existingTransferProductTrfId,
        mr_id: existingTransferProductMrId,
        product: existingTransferProductName,
        quantity: existingTransferProductQuantity,
      } = existingTransferProduct;

      const qtyDifference = Math.abs(
        existingTransferProductQuantity - (newQuantity || 0)
      );

      const existingTransfer = await findTransferByTrfId(
        existingTransferProductTrfId
      );
      if (!existingTransfer) {
        return res.status(404).json({
          message: `The transfer ID "${existingTransferProductTrfId}" was not found. Please verify the transfer ID and try again.`,
        });
      }

      const {
        source_inventory: existingTransferSourceInventory,
        destination_inventory: existingTransferDestinationInventory,
      } = existingTransfer;

      const [productQuery] = await db
        .select()
        .from(inventoryProducts)
        .where(
          and(
            ilike(inventoryProducts.inventory, existingTransferSourceInventory),
            ilike(inventoryProducts.product, existingTransferProductName),
            ilike(inventoryProducts.mr_id, existingTransferProductMrId),
            gte(inventoryProducts.quantity, qtyDifference)
          )
        )
        .limit(1);

      if (!productQuery) {
        return res.status(404).json({
          message: `The source inventory "${existingTransferSourceInventory}" does not have enough "${existingTransferProductName}" to fulfill the transfer product with ID "${id}". Please verify the inventory and try again.`,
        });
      }
      let altQty;
      if (newQuantity === undefined) {
        altQty = newQuantity || existingTransferProductQuantity;
      } else {
        altQty = newQuantity;
      }

      let updatedRecord;
      await db.transaction(async (tx) => {
        await tx
          .update(inventoryProducts)
          .set({
            quantity: sql`(${inventoryProducts.quantity} + ${existingTransferProductQuantity}) - ${altQty}`,
            updated_at: new Date().toISOString(),
          })
          .where(
            and(
              ilike(
                inventoryProducts.inventory,
                existingTransferSourceInventory
              ),
              ilike(inventoryProducts.product, existingTransferProductName),
              ilike(inventoryProducts.mr_id, existingTransferProductMrId)
            )
          )
          .returning();

        await tx
          .update(inventoryProducts)
          .set({
            quantity: sql`(${inventoryProducts.quantity} - ${existingTransferProductQuantity}) + ${altQty}`,
            updated_at: new Date().toISOString(),
          })
          .where(
            and(
              ilike(
                inventoryProducts.inventory,
                existingTransferDestinationInventory
              ),
              ilike(inventoryProducts.product, existingTransferProductName),
              ilike(inventoryProducts.mr_id, existingTransferProductMrId)
            )
          )
          .returning();

        [updatedRecord] = await tx
          .update(transferProducts)
          .set({
            quantity: altQty,
            updated_at: new Date().toISOString(),
          })
          .where(eq(transferProducts.id, id))
          .returning();
      });
      res.status(200).json({
        message: "Transfer product updated successfully",
        record: updatedRecord,
      });
    } catch (error) {
      console.error("An error occurred while updating transfer product", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while updating the transfer product. Please try again.",
        error: error.message,
      });
    }
  },
  deleteById: async (req, res) => {
    try {
      const { id } = req.params;

      let deletedRecord;
      await db.transaction(async (tx) => {
        [deletedRecord] = await tx
          .delete(transferProducts)
          .where(eq(transferProducts.id, id))
          .returning();
        if (!deletedRecord) {
          tx.rollback();
        }
        const {
          trf_id: deletedTrfId,
          mr_id: deletedMrId,
          product: deletedProduct,
          quantity: deletedQuantity,
        } = deletedRecord;

        const existingTransfer = await findTransferByTrfId(deletedTrfId, tx);
        if (!existingTransfer) {
          tx.rollback();
        }
        const {
          source_inventory: existingTransferSourceInventory,
          destination_inventory: existingTransferDestinationInventory,
        } = existingTransfer;

        const [DestinationInventoryProduct] = await tx
          .select()
          .from(inventoryProducts)
          .where(
            and(
              ilike(
                inventoryProducts.inventory,
                existingTransferDestinationInventory
              ),
              ilike(inventoryProducts.product, deletedProduct),
              ilike(inventoryProducts.mr_id, deletedMrId)
            )
          )
          .limit(1);
        const { quantity: availableQuantity } = DestinationInventoryProduct;

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
              ilike(inventoryProducts.product, deletedProduct),
              ilike(inventoryProducts.mr_id, deletedMrId)
            )
          );

        await tx
          .delete(inventoryProducts)
          .where(
            and(
              ilike(
                inventoryProducts.inventory,
                existingTransferDestinationInventory
              ),
              ilike(inventoryProducts.product, deletedProduct),
              ilike(inventoryProducts.mr_id, deletedMrId)
            )
          );
      });

      res.status(200).json({
        message: "Transfer product deleted successfully",
      });
    } catch (error) {
      console.error("An error occurred while deleting transfer product", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while deleting the transfer product. Please try again.",
        error: error.message,
      });
    }
  },
};
