import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { priceValidation } from "../../utils/priceValidation";
import { products } from "../index";

export const insertProductSchema = createInsertSchema(products, {
  name: z
    .string({
      required_error: "Product name is required",
    })
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(80, { message: "Name must not exceed 80 characters" }),
  description: z
    .string()
    .max(750, { message: "Description must not exceed 750 characters" })
    .optional(),
  price: z
    .number({
      required_error: "Product price is required",
      invalid_type_error: "Product price must be a Number",
    })
    .refine((value) => value !== undefined && value !== null, {
      message: "Price is required",
    })
    .refine((value) => priceValidation(value), {
      message:
        "Price must have a maximum of 10 digits in total and 3 digits after the decimal point",
    }),
  category: z
    .string({
      required_error: "Category name is required",
    })
    .max(80, { message: "category name must not exceed 80 characters" })
    .nonempty({ message: "category name is required" }),
  sku: z
    .string({
      required_error: "SKU is required",
    })
    .min(6, { message: "SKU be at least 6 characters long" })
    .max(20, { message: "SKU must not exceed 20 characters" }),
});

export const updateProductSchema = createInsertSchema(products, {
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(80, { message: "Name must not exceed 80 characters" })
    .optional(),
  description: z
    .string()
    .max(750, { message: "Description must not exceed 750 characters" })
    .optional(),
  price: z
    .number()
    .optional()
    .refine(
      (value) => {
        if (value === undefined || isNaN(value)) return true;
        return priceValidation(value);
      },
      {
        message:
          "Price must have a maximum of 10 digits in total and 3 digits after the decimal point",
      }
    ),
  category: z
    .string()
    .max(80, { message: "category name must not exceed 80 characters" })
    .optional(),
  sku: z
    .string()
    .min(6, { message: "SKU be at least 6 characters long" })
    .max(20, { message: "SKU must not exceed 20 characters" })
    .optional(),
});
