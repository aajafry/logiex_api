import { and, eq, gte, ilike, sql, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "../database/connection.js";
import {
  inventoryProducts,
  saleProducts,
  sales,
  updateSaleProductSchema,
} from "../schemas/index.js";
import { calculateSalePrice } from "../services/index.js";

export const saleProductsController = {
  retrieveAll: async (req, res) => {
    try {
      const allSaleProducts = await db.query.saleProducts.findMany({
        orderBy: [desc(saleProducts.created_at)],
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
    } catch (error) {
      console.error("An error occurred while retrieving sale products", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving sale products. Please try again.",
        error: error.message,
      });
    }
  },
  retrieveById: async (req, res) => {
    try {
      const { id } = req.params;
      const saleProduct = await db.query.saleProducts.findFirst({
        where: eq(saleProducts.id, id),
        orderBy: [desc(saleProducts.created_at)],
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
    } catch (error) {
      console.error("An error occurred while retrieving sale product", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving the sale product. Please try again.",
        error: error.message,
      });
    }
  },
  updateById: async (req, res) => {
    try {
      await updateSaleProductSchema.parseAsync(req.body);
      const { id } = req.params;
      const { quantity, unit_price, discount } = req.body;
      const parseQuantity = parseInt(quantity);
      const parseDiscount = parseFloat(discount);
      const parseUnitPrice = parseFloat(unit_price);

      const [existingSaleProduct] = await db
        .select()
        .from(saleProducts)
        .where(eq(saleProducts.id, id))
        .limit(1);

      if (!existingSaleProduct) {
        return res.status(404).json({
          message: `The sale product ID "${id}" was not found. Please verify the ID.`,
        });
      }

      const {
        bill_id: existingSaleProductBillId,
        mr_id: existingSaleProductMrId,
        product: existingSaleProductName,
        quantity: existingSaleProductQuantity,
        inventory: existingSaleProductInventory,
        unit_price: existingSaleProductUnitPrice,
        discount: existingSaleProductDiscount,
      } = existingSaleProduct;

      if (parseQuantity && existingSaleProductQuantity < parseQuantity) {
        const qtyDifference = parseQuantity - existingSaleProductQuantity;

        const [inventoryQuery] = await db
          .select()
          .from(inventoryProducts)
          .where(
            and(
              ilike(inventoryProducts.mr_id, existingSaleProductMrId),
              ilike(inventoryProducts.inventory, existingSaleProductInventory),
              ilike(inventoryProducts.product, existingSaleProductName),
              gte(inventoryProducts.quantity, qtyDifference)
            )
          )
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

      const totalPrice =
        productQty * unitPrice - (productQty * unitPrice * discountPrice) / 100;

      const updatedData = {
        quantity: productQty,
        unit_price: unitPrice,
        discount: discountPrice,
        total_price: totalPrice,
        updated_at: new Date().toISOString(),
      };

      let updatedSale;
      await db.transaction(async (tx) => {
        [updatedSale] = await tx
          .update(saleProducts)
          .set(updatedData)
          .where(eq(saleProducts.id, id))
          .returning();

        const updatedTotalPrice = await calculateSalePrice(
          existingSaleProductBillId,
          tx
        );

        await tx
          .update(sales)
          .set({
            total_amount: updatedTotalPrice,
            updated_at: new Date().toISOString(),
          })
          .where(ilike(sales.bill_id, existingSaleProductBillId))
          .returning();

        await tx
          .update(inventoryProducts)
          .set({
            quantity: sql`${inventoryProducts.quantity} + ${existingSaleProductQuantity}`,
            updated_at: new Date().toISOString(),
          })
          .where(
            and(
              ilike(inventoryProducts.mr_id, existingSaleProductMrId),
              ilike(inventoryProducts.product, existingSaleProductName),
              ilike(inventoryProducts.inventory, existingSaleProductInventory)
            )
          )
          .returning();

        await tx
          .update(inventoryProducts)
          .set({
            quantity: sql`${inventoryProducts.quantity} - ${productQty}`,
            updated_at: new Date().toISOString(),
          })
          .where(
            and(
              ilike(inventoryProducts.mr_id, existingSaleProductMrId),
              ilike(inventoryProducts.product, existingSaleProductName),
              ilike(inventoryProducts.inventory, existingSaleProductInventory)
            )
          )
          .returning();
      });

      res.status(200).json({
        message: `The sale product ID "${id}" has been updated successfully.`,
        sale: updatedSale,
      });
    } catch (error) {
      console.error("An error occurred while updating sale product", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while updating the sale product. Please try again.",
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
          .delete(saleProducts)
          .where(eq(saleProducts.id, id))
          .returning();

        if (!deletedRecord) {
          tx.rollback();
        }

        const {
          bill_id: deletedRecordBillId,
          mr_id: deletedRecordMrId,
          product: deletedRecordProduct,
          quantity: deletedRecordQuantity,
          inventory: deletedRecordInventory,
        } = deletedRecord;

        const updatedTotalPrice = await calculateSalePrice(
          deletedRecordBillId,
          tx
        );

        await tx
          .update(sales)
          .set({
            total_amount: updatedTotalPrice,
            updated_at: new Date().toISOString(),
          })
          .where(ilike(sales.bill_id, deletedRecordBillId))
          .returning();

        await tx
          .update(inventoryProducts)
          .set({
            quantity: sql`${inventoryProducts.quantity} + ${deletedRecordQuantity}`,
            updated_at: new Date().toISOString(),
          })
          .where(
            and(
              ilike(inventoryProducts.mr_id, deletedRecordMrId),
              ilike(inventoryProducts.product, deletedRecordProduct),
              ilike(inventoryProducts.inventory, deletedRecordInventory)
            )
          )
          .returning();
      });

      res.status(200).json({
        message: `The sale product ID "${id}" has been deleted successfully`,
      });
    } catch (error) {
      console.error(
        "An error occurred while deleting sale product by id",
        error
      );
      res.status(500).json({
        message: "An error occurred while deleting sale product by id",
        error: error.message,
      });
    }
  },
};