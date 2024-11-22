import { eq, desc } from "drizzle-orm";
import { db } from "../database/connection.js";
import { inventoryProducts } from "../schemas/index.js";

export const inventoryProductsController = {
  retrieveAll: async (req, res) => {
    try {
      const inventoryProductRecords = await db.query.inventoryProducts.findMany(
        {
          orderBy: [desc(inventoryProducts.created_at)],
          with: {
            purchase: false,
            inventory: false,
            product: false,
          },
        }
      );
      res.status(200).json({
        message:
          "All inventories with associated products retrieved successfully",
        records: inventoryProductRecords,
      });
    } catch (error) {
      console.error(
        "An error occurred while retrieving all inventory with associated products:",
        error
      );
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving all inventory with associated products. Please try again.",
        error: error.message,
      });
    }
  },
  retrieveById: async (req, res) => {
    try {
      const { id } = req.params;
      const inventoryProductRecord = await db.query.inventoryProducts.findFirst(
        {
          where: eq(inventoryProducts.id, id),
          orderBy: [desc(inventoryProducts.created_at)],
          with: {
            purchase: false,
            inventory: false,
            product: false,
          },
        }
      );

      if (!inventoryProductRecord) {
        return res.status(404).json({
          message: `Inventory with associated product not found with the provided ID "${id}". Please verify the ID.`,
        });
      }

      res.status(200).json({
        message: "Inventory with associated product retrieved successfully",
        record: inventoryProductRecord,
      });
    } catch (error) {
      console.error(
        "An error occurred while retrieving inventory with associated product",
        error
      );
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving inventory with associated product. Please try again.",
        error: error.message,
      });
    }
  },
};
