import { eq , desc} from "drizzle-orm";
import { z } from "zod";
import { db } from "../database/connection.js";
import {
  shipmentProducts,
  updateShipmentProductSchema,
} from "../schemas/index.js";
import { findSaleByBillId, findShipmentBySid } from "../services/index.js";

export const shipmentProductsController = {
  retrieveAll: async (req, res) => {
    try {
      const allShipmentProduct = await db.query.shipmentProducts.findMany({
        orderBy: [desc(shipmentProducts.created_at)],
        columns: {
          bill_id: false,
        },
        with: {
          shipment: false,
          sale: {
            columns: {
              id: false,
            },
          },
        },
      });

      res.status(200).json({
        message: "Shipment products retrieved successfully",
        records: allShipmentProduct,
      });
    } catch (error) {
      console.error(
        "An error occurred while retrieving all Shipment product",
        error
      );
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving Shipment product. Please try again.",
        error: error.message,
      });
    }
  },
  retrieveById: async (req, res) => {
    try {
      const { id } = req.params;
      const shipmentProduct = await db.query.shipmentProducts.findFirst({
        where: eq(shipmentProducts.id, id),
        orderBy: [desc(shipmentProducts.created_at)],
        columns: {
          bill_id: false,
        },
        with: {
          shipment: false,
          sale: {
            columns: {
              id: false,
            },
          },
        },
      });

      if (!shipmentProduct) {
        return res.status(404).json({
          message: `Shipment product ID ${id} was not found. Please verify the ID and try again.`,
        });
      }
      res.status(200).json({
        message: "Shipment product retrieved successfully",
        record: shipmentProduct,
      });
    } catch (error) {
      console.error(
        "An error occurred while retrieving shipment product",
        error
      );
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving the shipment product. Please try again.",
        error: error.message,
      });
    }
  },
  updateById: async (req, res) => {
    try {
      await updateShipmentProductSchema.parseAsync(req.body);
      const { id } = req.params;
      const { shipment_id, bill_id } = req.body;

      const [existingShipmentProduct] = await db
        .select()
        .from(shipmentProducts)
        .where(eq(shipmentProducts.id, id))
        .limit(1);

      if (!existingShipmentProduct) {
        return res.status(404).json({
          message: `Shipment product ID ${id} was not found. Please verify the ID and try again.`,
        });
      }

      const {
        shipment_id: existingShipmentProductSID,
        bill_id: existingShipmentProductBillID,
      } = existingShipmentProduct;

      if (shipment_id && shipment_id !== existingShipmentProductSID) {
        const shipmentValidation = await findShipmentBySid(shipment_id);
        if (!shipmentValidation) {
          return res.status(404).json({
            message: `The shipment ID ${shipment_id} was not found. Please verify the ID and try again.`,
          });
        }
      }

      if (bill_id && bill_id !== existingShipmentProductBillID) {
        const billValidation = await findSaleByBillId(bill_id);
        if (!billValidation) {
          return res.status(404).json({
            message: `The BILL ID ${bill_id} was not found. Please verify the ID and try again.`,
          });
        }
      }

      const updatedData = {
        shipment_id: shipment_id || existingShipmentProductSID,
        bill_id: bill_id || existingShipmentProductBillID,
        updated_at: new Date().toISOString(),
      };

      const [updatedShipmentProduct] = await db
        .update(shipmentProducts)
        .set(updatedData)
        .where(eq(shipmentProducts.id, id))
        .returning();

      if (!updatedShipmentProduct) {
        return res.status(409).json({
          message: `An error occurred while updating the shipment product. Please try again.`,
        });
      }

      res.status(200).json({
        message: "Shipment product updated successfully",
        record: updatedShipmentProduct,
      });
    } catch (error) {
      console.error("An error occurred while updating shipment product", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while updating shipment product. Please try again.",
        error: error.message,
      });
    }
  },
  deleteById: async (req, res) => {
    try {
      const { id } = req.params;

      const [deletedRecord] = await db
        .delete(shipmentProducts)
        .where(eq(shipmentProducts.id, id))
        .returning();

      if (!deletedRecord) {
        return res.status(404).json({
          message: `Shipment product ID ${id} was not found. Please verify the ID and try again.`,
        });
      }

      res.status(200).json({
        message: "Shipment product deleted successfully",
        record: deletedRecord,
      });
    } catch (error) {
      console.error("An error occurred while deleting shipment product", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while deleting the shipment product. Please try again.",
        error: error.message,
      });
    }
  },
};
