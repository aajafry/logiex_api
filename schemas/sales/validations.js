import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { priceValidation } from "../../utils/priceValidation.js";
import { sales } from "../index.js";
import { salesStatusEnum } from "../../utils/enum.js";

export const insertSaleSchema = createInsertSchema(sales, {
  bill_id: z
    .string({
      required_error: "Bill ID is required",
    })
    .max(20, { message: "BILL ID must not exceed 20 characters" })
    .nonempty({ message: "BILL ID is required" }),
  sale_date: z.coerce.date({ message: "Invalid date" }).optional(),
  customer_id: z
    .string({
      required_error: "Customer ID is required",
    })
    .uuid({ message: "Invalid customer ID" })
    .min(1, { message: "Customer ID is required" }),
  shipping_address: z
    .string({
      required_error: "Shipping address is required",
    })
    .max(255, { message: "Address must not exceed 255 characters" })
    .nonempty({ message: "Address is required" }),
  status: z.enum(salesStatusEnum).optional(),
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

export const updateSaleSchema = createInsertSchema(sales, {
  bill_id: z
    .string()
    .max(20, { message: "BILL ID must not exceed 20 characters" })
    .optional(),
  sale_date: z.coerce.date({ message: "Invalid date" }).optional(),
  customer_id: z.string().uuid({ message: "Invalid customer ID" }).optional(),
  shipping_address: z
    .string()
    .max(255, { message: "Address must not exceed 255 characters" })
    .optional(),
  inventory: z
    .string()
    .max(80, { message: "Inventory name must not exceed 80 characters" })
    .optional(),
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
  status: z.enum(salesStatusEnum).optional(),
});
