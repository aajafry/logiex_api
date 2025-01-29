import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { priceValidation } from "../../utils/priceValidation";
import { saleProducts } from "../index";

export const insertSaleProductSchema = createInsertSchema(saleProducts, {
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
    .number({
      required_error: "Product quantity is required",
    })
    .positive({ message: "Product quantity must be a positive number" })
    .int({ message: "Product quantity must be an integer" }),
  unit_price: z
    .number({
      required_error: "Product unit price is required",
    })
    .refine((value) => value !== undefined && value !== null, {
      message: "Unit price is required",
    })
    .refine((value) => priceValidation(value), {
      message:
        "Unit price must have a maximum of 10 digits in total and 3 digits after the decimal point",
    }),
  discount: z
    .number()
    .gte(0, { message: "Discount must have a minimum of zero percent" })
    .lte(100, { message: "Discount must have a maximum of hundred percent" })
    .optional(),
}).omit({
  inventory: true,
  discount: true,
  mr_id: true,
  total_price: true,
});

export const updateSaleProductSchema = createInsertSchema(saleProducts, {
  quantity: z
    .number()
    .positive({ message: "Product quantity must be a positive number" })
    .int({ message: "Product quantity must be an integer" })
    .optional(),
  unit_price: z
    .number()
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
    .number()
    .gte(0, { message: "Discount must have a minimum of zero percent" })
    .lte(100, { message: "Discount must have a maximum of hundred percent" })
    .optional(),
}).omit({
  quantity: true,
  unit_price: true,
  discount: true,
});
