import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { priceValidation } from "../../utils/priceValidation";
import { purchases } from "../index";

export const insertPurchaseSchema = createInsertSchema(purchases, {
  mr_id: z
    .string({
      required_error: "MR ID is required",
    })
    .min(6, { message: "MR ID be at least 6 characters long" })
    .max(20, { message: "MR ID must not exceed 20 characters" }),
  purchase_date: z.coerce.date({ message: "Invalid date" }).optional(),
  vendor: z
    .string({
      required_error: "Vendor name is required",
    })
    .max(80, { message: "Vendor name must not exceed 80 characters" })
    .nonempty({ message: "Vendor name is required" }),
  inventory: z
    .string({
      required_error: "Inventory name is required",
    })
    .max(80, { message: "Inventory name must not exceed 80 characters" })
    .nonempty({ message: "Inventory name is required" }),
  adjustment: z
    .number()
    .optional()
    .refine(
      (value) => {
        if (value === undefined || isNaN(value)) return true;
        return priceValidation(value);
      },
      {
        message:
          "Adjustment price must have a maximum of 10 digits in total and 3 digits after the decimal point",
      }
    ),
});

export const updatePurchaseSchema = createInsertSchema(purchases, {
  mr_id: z
    .string()
    .min(6, { message: "MR ID be at least 6 characters long" })
    .max(20, { message: "MR ID must not exceed 20 characters" })
    .optional(),
  purchase_date: z.coerce.date({ message: "Invalid date" }).optional(),
  vendor: z
    .string()
    .max(80, { message: "Vendor name must not exceed 80 characters" })
    .optional(),
  inventory: z
    .string()
    .max(80, { message: "Inventory name must not exceed 80 characters" })
    .optional(),
  adjustment: z
    .number({
      invalid_type_error: "Product adjustment must be a Number",
    })
    .optional()
    .refine(
      (value) => {
        if (value === undefined || isNaN(value)) return true;
        return priceValidation(value);
      },
      {
        message:
          "Adjustment price must have a maximum of 10 digits in total and 3 digits after the decimal point",
      }
    ),
});
