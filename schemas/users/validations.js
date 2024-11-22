import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { userRolesEnum } from "../../utils/enum.js";
import { users } from "../index.js";

export const insertUserSchema = createInsertSchema(users, {
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(80, { message: "Name must not exceed 80 characters" }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Invalid email address" })
    .max(150, { message: "Email must not exceed 150 characters" }),
  phone: z
    .string({
      required_error: "Phone number is required",
    })
    .min(10, { message: "Phone number must be at least 10 digits long" })
    .max(16, { message: "Phone number must not exceed 16 digits" }),
  avatar: z
    .string()
    .max(255, { message: "avatar URL must not exceed 255 characters" })
    .optional(),
  address: z
    .string()
    .max(255, { message: "Address must not exceed 255 characters" })
    .nonempty({ message: "Address is required" }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(32, { message: "Password must not exceed 32 characters" }),
  role: z.enum(userRolesEnum),
  national_id: z
    .string()
    .max(20, { message: "NID must not exceed 20 characters" })
    .optional(),
  driving_license_no: z
    .string()
    .max(20, { message: "Driving license must not exceed 20 characters" })
    .optional(),
  passport_no: z
    .string()
    .max(20, { message: "Passport no must not exceed 20 characters" })
    .optional(),
});

export const updateUserSchema = createInsertSchema(users, {
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
  avatar: z
    .string()
    .max(255, { message: "avatar URL must not exceed 255 characters" })
    .optional(),
  address: z
    .string()
    .max(255, { message: "Address must not exceed 255 characters" })
    .optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .optional(),
  role: z.enum(userRolesEnum).optional(),
  national_id: z
    .string()
    .max(20, { message: "NID must not exceed 20 characters" })
    .optional(),
  driving_license_no: z
    .string()
    .max(20, { message: "Driving license must not exceed 20 characters" })
    .optional(),
  passport_no: z
    .string()
    .max(20, { message: "Passport no must not exceed 20 characters" })
    .optional(),
});

export const registerUserSchema = createInsertSchema(users, {
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(80, { message: "Name must not exceed 80 characters" }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Invalid email address" })
    .max(150, { message: "Email must not exceed 150 characters" }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(32, { message: "Password must not exceed 32 characters" }),
});

export const loginUserSchema = createInsertSchema(users, {
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Invalid email address" })
    .max(150, { message: "Email must not exceed 150 characters" }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(32, { message: "Password must not exceed 32 characters" }),
}).pick({ name: false, email: true, password: true });

export const verifyEmailUserSchema = createInsertSchema(users, {
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Invalid email address" })
    .max(150, { message: "Email must not exceed 150 characters" }),
}).pick({ name: false, email: true, password: false });

export const resetPasswordUserSchema = createInsertSchema(users, {
  reset_password_token: z
    .string({
      required_error: "Token is required",
    })
    .nonempty({ message: "Token is required" }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(32, { message: "Password must not exceed 32 characters" }),
}).pick({
  name: false,
  email: false,
  password: true,
  reset_password_token: true,
});
