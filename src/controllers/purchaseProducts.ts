import { and, desc, eq, ilike } from "drizzle-orm";
import { Request, RequestHandler, Response } from "express";
import { z } from "zod";
import { db } from "../database/connection";
import {
  inventoryProducts,
  purchaseProducts,
  purchases,
  updatePurchaseProductSchema,
} from "../schemas/index";
import { calculatePurchasePrice } from "../services/index";

export const purchaseProductsController = {
  retrieveAll: (async (req: Request, res: Response) => {
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

      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while retrieving purchase products. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
  retrieveById: (async (req: Request, res: Response) => {
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

      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while retrieving the purchase product. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
  updateById: (async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { quantity, discount, unit_price } =
        await updatePurchaseProductSchema.parseAsync(req.body);

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

      const productQty = quantity || existingPurchaseProductQuantity;
      const unitPrice = unit_price || existingPurchaseProductUnitPrice;
      const discountPrice = discount || existingPurchaseProductDiscount;

      const totalPrice = Number(
        (productQty * unitPrice * (1 - discountPrice / 100)).toFixed(3)
      );


      let updatedPurchase;
      await db.transaction(async (tx: any) => {
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
      console.error(
        "An error occurred while updating purchase product:",
        error
      );

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }

      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while updating the purchase product. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
  deleteById: (async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      let deletedRecord;
      await db.transaction(async (tx: any) => {
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

      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while deleting the purchase product. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
};
