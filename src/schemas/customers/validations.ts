import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { customers } from "../index";

export const insertCustomerSchema = createInsertSchema(customers, {
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(80, { message: "Name must not exceed 80 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(150, { message: "Email must not exceed 150 characters" })
    .optional(),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits long" })
    .max(16, { message: "Phone number must not exceed 16 digits" })
    .optional(),
  address: z
    .string()
    .max(255, { message: "Address must not exceed 255 characters" })
    .optional(),
});

export const updateCustomerSchema = createInsertSchema(customers, {
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(80, { message: "Name must not exceed 80 characters" })
    .optional(),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(150, { message: "Email must not exceed 150 characters" })
    .optional(),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits long" })
    .max(16, { message: "Phone number must not exceed 16 digits" })
    .optional(),
  address: z
    .string()
    .max(255, { message: "Address must not exceed 255 characters" })
    .optional(),
});
