import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { categories } from "../index.js";

export const insertCategorySchema = createInsertSchema(categories, {
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(80, { message: "Name must not exceed 80 characters" }),
  description: z
    .string()
    .max(750, { message: "Description must not exceed 750 characters" })
    .optional(),
});

export const updateCategorySchema = createInsertSchema(categories, {
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(80, { message: "Name must not exceed 80 characters" })
    .optional(),
  description: z
    .string()
    .max(750, { message: "Description must not exceed 750 characters" })
    .optional(),
});
