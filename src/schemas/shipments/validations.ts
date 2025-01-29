import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { shipmentStatusEnum } from "../../utils/enum";
import { shipments } from "../index";

export const insertShipmentSchema = createInsertSchema(shipments, {
  shipment_id: z
    .string({
      required_error: "Shipment ID is required",
    })
    .max(20, { message: "Shipment ID must not exceed 20 characters" })
    .nonempty({ message: "Shipment ID is required" }),
  shipment_date: z.coerce.date({ message: "Invalid date" }).optional(),
  vehicle_vin: z
    .string({
      required_error: "Vehicle VIN is required",
    })
    .max(20, { message: "Vehicle VIN must not exceed 20 characters" })
    .nonempty({ message: "Vehicle VIN is required" }),
  captain_id: z
    .string({
      required_error: "Captain ID is required",
    })
    .uuid({ message: "Invalid captain ID" })
    .min(1, { message: "Captain ID is required" }),
  status: z.enum(shipmentStatusEnum).optional(),
});

export const updateShipmentSchema = createInsertSchema(shipments, {
  shipment_id: z
    .string()
    .max(20, { message: "Shipment ID must not exceed 20 characters" })
    .optional(),
  shipment_date: z.coerce.date({ message: "Invalid date" }).optional(),
  vehicle_vin: z
    .string()
    .max(20, { message: "Vehicle VIN must not exceed 20 characters" })
    .optional(),
  captain_id: z.string().uuid({ message: "Invalid captain ID" }).optional(),
  status: z.enum(shipmentStatusEnum).optional(),
});
