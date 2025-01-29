"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordUserSchema = exports.verifyEmailUserSchema = exports.loginUserSchema = exports.registerUserSchema = exports.updateUserSchema = exports.insertUserSchema = void 0;
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
const enum_1 = require("../../utils/enum");
const index_1 = require("../index");
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.users, {
    name: zod_1.z
        .string({
        required_error: "Name is required",
    })
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(80, { message: "Name must not exceed 80 characters" }),
    email: zod_1.z
        .string({
        required_error: "Email is required",
    })
        .email({ message: "Invalid email address" })
        .max(150, { message: "Email must not exceed 150 characters" }),
    phone: zod_1.z
        .string({
        required_error: "Phone number is required",
    })
        .min(10, { message: "Phone number must be at least 10 digits long" })
        .max(16, { message: "Phone number must not exceed 16 digits" }),
    avatar: zod_1.z
        .string()
        .max(255, { message: "avatar URL must not exceed 255 characters" })
        .optional(),
    address: zod_1.z
        .string()
        .max(255, { message: "Address must not exceed 255 characters" })
        .nonempty({ message: "Address is required" }),
    password: zod_1.z
        .string({
        required_error: "Password is required",
    })
        .min(8, { message: "Password must be at least 8 characters" })
        .max(32, { message: "Password must not exceed 32 characters" }),
    role: zod_1.z.enum(enum_1.userRolesEnum),
    national_id: zod_1.z
        .string()
        .max(20, { message: "NID must not exceed 20 characters" })
        .optional(),
    driving_license_no: zod_1.z
        .string()
        .max(20, { message: "Driving license must not exceed 20 characters" })
        .optional(),
    passport_no: zod_1.z
        .string()
        .max(20, { message: "Passport no must not exceed 20 characters" })
        .optional(),
});
exports.updateUserSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.users, {
    name: zod_1.z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(80, { message: "Name must not exceed 80 characters" })
        .optional(),
    email: zod_1.z
        .string()
        .email({ message: "Invalid email address" })
        .max(150, { message: "Email must not exceed 150 characters" })
        .optional(),
    phone: zod_1.z
        .string()
        .min(10, { message: "Phone number must be at least 10 digits long" })
        .max(16, { message: "Phone number must not exceed 16 digits" })
        .optional(),
    avatar: zod_1.z
        .string()
        .max(255, { message: "avatar URL must not exceed 255 characters" })
        .optional(),
    address: zod_1.z
        .string()
        .max(255, { message: "Address must not exceed 255 characters" })
        .optional(),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .optional(),
    role: zod_1.z.enum(enum_1.userRolesEnum).optional(),
    national_id: zod_1.z
        .string()
        .max(20, { message: "NID must not exceed 20 characters" })
        .optional(),
    driving_license_no: zod_1.z
        .string()
        .max(20, { message: "Driving license must not exceed 20 characters" })
        .optional(),
    passport_no: zod_1.z
        .string()
        .max(20, { message: "Passport no must not exceed 20 characters" })
        .optional(),
});
exports.registerUserSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.users, {
    name: zod_1.z
        .string({
        required_error: "Name is required",
    })
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(80, { message: "Name must not exceed 80 characters" }),
    email: zod_1.z
        .string({
        required_error: "Email is required",
    })
        .email({ message: "Invalid email address" })
        .max(150, { message: "Email must not exceed 150 characters" }),
    password: zod_1.z
        .string({
        required_error: "Password is required",
    })
        .min(8, { message: "Password must be at least 8 characters" })
        .max(32, { message: "Password must not exceed 32 characters" }),
});
exports.loginUserSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.users, {
    email: zod_1.z
        .string({
        required_error: "Email is required",
    })
        .email({ message: "Invalid email address" })
        .max(150, { message: "Email must not exceed 150 characters" }),
    password: zod_1.z
        .string({
        required_error: "Password is required",
    })
        .min(8, { message: "Password must be at least 8 characters" })
        .max(32, { message: "Password must not exceed 32 characters" }),
}).omit({ name: true });
exports.verifyEmailUserSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.users, {
    email: zod_1.z
        .string({
        required_error: "Email is required",
    })
        .email({ message: "Invalid email address" })
        .max(150, { message: "Email must not exceed 150 characters" }),
}).omit({ name: true, password: true });
exports.resetPasswordUserSchema = (0, drizzle_zod_1.createInsertSchema)(index_1.users, {
    reset_password_token: zod_1.z
        .string({
        required_error: "Token is required",
    })
        .nonempty({ message: "Token is required" }),
    password: zod_1.z
        .string({
        required_error: "Password is required",
    })
        .min(8, { message: "Password must be at least 8 characters" })
        .max(32, { message: "Password must not exceed 32 characters" }),
}).omit({
    name: true,
    email: true,
});
