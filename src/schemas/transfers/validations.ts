import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { transfers } from "../index";

export const insertTransferSchema = createInsertSchema(transfers, {
  trf_id: z
    .string({
      required_error: "TRF ID is required",
    })
    .min(6, { message: "TRF ID be at least 6 characters long" })
    .max(20, { message: "TRF ID must not exceed 20 characters" }),
  transfer_date: z.coerce.date({ message: "Invalid date" }).optional(),
  source_inventory: z
    .string({
      required_error: "Source inventory name is required",
    })
    .max(80, { message: "Source inventory name must not exceed 80 characters" })
    .nonempty({ message: "Source inventory name is required" }),
  destination_inventory: z
    .string({
      required_error: "Destination inventory is required",
    })
    .max(80, {
      message: "Destination inventory name must not exceed 80 characters",
    })
    .nonempty({ message: "Destination inventory name is required" }),
});

export const updateTransferSchema = createInsertSchema(transfers, {
  trf_id: z
    .string({
      required_error: "TRF ID is required",
    })
    .min(6, { message: "TRF ID be at least 6 characters long" })
    .max(20, { message: "TRF ID must not exceed 20 characters" })
    .optional(),
  transfer_date: z.coerce.date({ message: "Invalid date" }).optional(),
  source_inventory: z
    .string({
      required_error: "Source inventory name is required",
    })
    .max(80, { message: "Source inventory name must not exceed 80 characters" })
    .optional(),
  destination_inventory: z
    .string({
      required_error: "Destination inventory is required",
    })
    .max(80, {
      message: "Destination inventory name must not exceed 80 characters",
    })
    .optional(),
});
