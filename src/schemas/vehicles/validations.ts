import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { vehicles } from "../index";
import { vehicleTypesEnum } from "../../utils/enum";

export const insertVehicleSchema = createInsertSchema(vehicles, {
  make: z
    .string({
      required_error: "Make is required",
    })
    .min(3, { message: "Make must be at least 3 characters long" })
    .max(80, { message: "Make must not exceed 80 characters" }),
  model: z
    .string()
    .min(1, { message: "Model must be at least 1 characters long" })
    .max(80, { message: "Model must not exceed 80 characters" })
    .optional(),
  year: z
    .number({
      required_error: "Year is required",
    })
    .int({ message: "Year must be an integer" })
    .min(1900, { message: "Year must be at least 1900" })
    .max(new Date().getFullYear(), {
      message: `Year must not exceed ${new Date().getFullYear()}`,
    }),
  color: z
    .string({
      required_error: "Color is required",
    })
    .min(3, { message: "Color must be at least 3 characters long" })
    .max(20, { message: "Color must not exceed 20 characters" }),
  mileage: z
    .number()
    .positive({ message: "Mileage must be a positive number" })
    .int({ message: "Mileage must be an integer" })
    .optional(),
  engine_no: z
    .string()
    .min(11, { message: "Engine number must be at least 11 characters long" })
    .max(20, { message: "Engine number must not exceed 20 characters" })
    .optional(),
  chassis_no: z
    .string()
    .min(11, { message: "Chassis number must be at least 11 characters long" })
    .max(20, { message: "Chassis number must not exceed 20 characters" })
    .optional(),
  vin: z
    .string({
      required_error: "VIN is required",
    })
    .min(17, { message: "VIN must be at least 17 characters long" })
    .max(20, { message: "VIN must not exceed 20 characters" }),
  plate_number: z
    .string({
      required_error: "Plate number is required",
    })
    .min(6, { message: "Plate number must be at least 6 characters long" })
    .max(20, { message: "Plate number must not exceed 20 characters" }),
  cargo_capacity: z
    .number({
      required_error: "Cargo capacity is required",
    })
    .positive({ message: "Cargo capacity must be a positive number" })
    .int({ message: "Cargo capacity must be an integer" }),
  type: z.enum(vehicleTypesEnum),
});

export const updateVehicleSchema = createInsertSchema(vehicles, {
  make: z
    .string()
    .min(3, { message: "Make must be at least 3 characters long" })
    .max(80, { message: "Make must not exceed 80 characters" })
    .optional(),
  model: z
    .string()
    .min(1, { message: "Model must be at least 1 characters long" })
    .max(80, { message: "Model must not exceed 80 characters" })
    .optional(),
  year: z
    .number()
    .int({ message: "Year must be an integer" })
    .min(1900, { message: "Year must be at least 1900" })
    .max(new Date().getFullYear(), {
      message: `Year must not exceed ${new Date().getFullYear()}`,
    })
    .optional(),
  color: z
    .string()
    .min(3, { message: "Color must be at least 3 characters long" })
    .max(20, { message: "Color must not exceed 20 characters" })
    .optional(),
  mileage: z
    .number()
    .positive({ message: "Mileage must be a positive number" })
    .int({ message: "Mileage must be an integer" })
    .optional(),
  engine_no: z
    .string()
    .min(11, { message: "Engine number must be at least 11 characters long" })
    .max(20, { message: "Engine number must not exceed 20 characters" })
    .optional(),
  chassis_no: z
    .string()
    .min(11, { message: "Chassis number must be at least 11 characters long" })
    .max(20, { message: "Chassis number must not exceed 20 characters" })
    .optional(),
  vin: z
    .string()
    .min(17, { message: "VIN must be at least 17 characters long" })
    .max(20, { message: "VIN must not exceed 20 characters" })
    .optional(),
  plate_number: z
    .string()
    .min(6, { message: "Plate number must be at least 6 characters long" })
    .max(20, { message: "Plate number must not exceed 20 characters" })
    .optional(),
  cargo_capacity: z
    .number()
    .positive({ message: "Cargo capacity must be a positive number" })
    .int({ message: "Cargo capacity must be an integer" })
    .optional(),
  type: z.enum(vehicleTypesEnum).optional(),
});
