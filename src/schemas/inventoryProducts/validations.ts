import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { inventoryProducts } from "../index";

export const insertInventoryProductSchema = createInsertSchema(inventoryProducts, {
  mr_id: z
    .string({
      required_error: "MR ID is required",
    })
    .max(20, { message: "MR ID must not exceed 20 characters" })
    .nonempty({ message: "MR ID is required" }),
  inventory: z
    .string({
      required_error: "Inventory name is required",
    })
    .max(80, { message: "Inventory name must not exceed 80 characters" })
    .nonempty({ message: "Inventory name is required" }),
  product: z
    .string({
      required_error: "Product name is required",
    })
    .max(80, { message: "Product name must not exceed 80 characters" })
    .nonempty({ message: "Product name is required" }),
  quantity: z
    .number()
    .positive({ message: "Product quantity must be a positive number" })
    .int({ message: "Product quantity must be an integer" }),
});

export const updateInventoryProductSchema = createInsertSchema(inventoryProducts, {
  quantity: z
    .number()
    .positive({ message: "Product quantity must be a positive number" })
    .int({ message: "Product quantity must be an integer" }),
});
