import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { priceValidation } from "../../utils/priceValidation";
import { purchaseProducts } from "../index";

export const insertPurchaseProductSchema = createInsertSchema(
  purchaseProducts,
  {
    product: z
      .string({
        required_error: "Product name is required",
      })
      .max(80, { message: "Product name must not exceed 80 characters" })
      .nonempty({ message: "Product name is required" }),
    quantity: z
      .number({
        required_error: "Product quantity is required",
        invalid_type_error: "Product quantity must be a Number",
      })
      .positive({ message: "Product quantity must be a positive number" })
      .int({ message: "Product quantity must be an integer" }),
    unit_price: z
      .number({
        required_error: "Product unit price is required",
        invalid_type_error: "Product unit price must be a Number",
      })
      .refine((value) => value !== undefined && value !== null, {
        message: "Unit price is required",
      })
      .refine((value) => priceValidation(value), {
        message:
          "Unit price must have a maximum of 10 digits in total and 3 digits after the decimal point",
      }),
    discount: z
      .number({
        invalid_type_error: "Product discount must be a Number",
      })
      .gte(0, { message: "Discount must have a minimum of zero percent" })
      .lte(100, { message: "Discount must have a maximum of hundred percent" })
      .optional(),
  }
).omit({
  mr_id: true,
  total_price: true,
});

export const updatePurchaseProductSchema = createInsertSchema(purchaseProducts, {
  quantity: z
    .number({
      invalid_type_error: "Product quantity must be a Number",
    })
    .positive()
    .optional(),
  unit_price: z
    .number({
      invalid_type_error: "Product unit price must be a Number",
    })
    .optional()
    .refine(
      (value) => {
        if (value === undefined || isNaN(value)) return true;
        return priceValidation(value);
      },
      {
        message:
          "Unit price must have a maximum of 10 digits in total and 3 digits after the decimal point",
      }
    ),
  discount: z
    .number({
      invalid_type_error: "Product discount must be a Number",
    })
    .gte(0, { message: "Discount must have a minimum of zero percent" })
    .lte(100, { message: "Discount must have a maximum of hundred percent" })
    .optional(),
}).omit({
  mr_id: true,
  product: true,
  total_price: true,
});
