import { and, eq, ilike, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "../database/connection.js";
import {
  inventoryProducts,
  purchases,
  purchaseProducts,
  updatePurchaseProductSchema,
} from "../schemas/index.js";
import { calculatePurchasePrice } from "../services/index.js";

export const purchaseProductsController = {
  retrieveAll: async (req, res) => {
    try {
      const allPurchaseProducts = await db.query.purchaseProducts.findMany({
        orderBy: [desc(purchaseProducts.created_at)],
        with: {
          purchase: false,
          product: false,
        },
      });
      res.status(200).json({
        message: "Purchase products retrieved successfully",
        records: allPurchaseProducts,
      });
    } catch (error) {
      console.error(
        "An error occurred while retrieving purchase products",
        error
      );
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving purchase products. Please try again.",
        error: error.message,
      });
    }
  },
  retrieveById: async (req, res) => {
    try {
      const { id } = req.params;
      const purchaseProduct = await db.query.purchaseProducts.findFirst({
        where: eq(purchaseProducts.id, id),
        orderBy: [desc(purchaseProducts.created_at)],
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
    } catch (error) {
      console.error(
        "An error occurred while retrieving purchase product",
        error
      );
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving the purchase product. Please try again.",
        error: error.message,
      });
    }
  },
  updateById: async (req, res) => {
    try {
      const { id } = req.params;
      await updatePurchaseProductSchema.parseAsync(req.body);
      const { quantity, discount, unit_price } = req.body;
      const parseQuantity = parseInt(quantity);
      const parseDiscount = parseFloat(discount);
      const parseUnitPrice = parseFloat(unit_price);

      const [existingPurchaseProduct] = await db
        .select()
        .from(purchaseProducts)
        .where(eq(purchaseProducts.id, id))
        .limit(1);

      if (!existingPurchaseProduct) {
        return res.status(404).json({
          message: `The purchase product ID "${id}" was not found. Please verify the ID.`,
        });
      }

      const {
        mr_id: existingPurchaseProductMrId,
        product: existingPurchaseProductName,
        quantity: existingPurchaseProductQuantity,
        unit_price: existingPurchaseProductUnitPrice,
        discount: existingPurchaseProductDiscount,
      } = existingPurchaseProduct;

      const productQty = parseQuantity || existingPurchaseProductQuantity;
      const unitPrice = parseUnitPrice || existingPurchaseProductUnitPrice;
      const discountPrice = parseDiscount || existingPurchaseProductDiscount;

      const totalPrice =
        productQty * unitPrice - (productQty * unitPrice * discountPrice) / 100;

      let updatedPurchase;
      await db.transaction(async (tx) => {
        [updatedPurchase] = await tx
          .update(purchaseProducts)
          .set({
            quantity: productQty,
            unit_price: unitPrice,
            discount: discountPrice,
            total_price: totalPrice,
            updated_at: new Date().toISOString(),
          })
          .where(eq(purchaseProducts.id, id))
          .returning();

        await tx
          .update(inventoryProducts)
          .set({
            quantity: productQty,
            updated_at: new Date().toISOString(),
          })
          .where(
            and(
              ilike(inventoryProducts.mr_id, existingPurchaseProductMrId),
              ilike(inventoryProducts.product, existingPurchaseProductName)
            )
          );

        const updatedTotalPrice = await calculatePurchasePrice(
          existingPurchaseProductMrId,
          tx
        );

        await tx
          .update(purchases)
          .set({
            total_price: updatedTotalPrice,
            updated_at: new Date().toISOString(),
          })
          .where(ilike(purchases.mr_id, existingPurchaseProductMrId));
      });
      res.status(200).json({
        message: `The purchase product ID "${id}" has been updated successfully.`,
        purchase: updatedPurchase,
      });
    } catch (error) {
      console.error("An error occurred while updating purchase product", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while updating the purchase product. Please try again.",
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
          .delete(purchaseProducts)
          .where(eq(purchaseProducts.id, id))
          .returning();

        if (!deletedRecord) {
          tx.rollback();
        }

        const { mr_id, product } = deletedRecord;

        await tx
          .delete(inventoryProducts)
          .where(
            and(
              ilike(inventoryProducts.mr_id, mr_id),
              ilike(inventoryProducts.product, product)
            )
          )
          .returning();

        const updatedTotalPrice = await calculatePurchasePrice(mr_id, tx);

        await tx
          .update(purchases)
          .set({
            total_price: updatedTotalPrice,
            updated_at: new Date().toISOString(),
          })
          .where(ilike(purchases.mr_id, mr_id));
      });

      res.status(200).json({
        message: `The purchase product ID "${id}" has been deleted successfully`,
      });
    } catch (error) {
      console.error("An error occurred while deleting purchase product", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while deleting the purchase product. Please try again.",
        error: error.message,
      });
    }
  },
};
