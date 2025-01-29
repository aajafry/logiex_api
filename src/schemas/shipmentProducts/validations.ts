import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { shipmentProducts } from "../index";

export const insertShipmentProductSchema = createInsertSchema(
  shipmentProducts,
  {
    bill_id: z
      .string({
        required_error: "BILL ID is required",
      })
      .max(20, { message: "BILL ID must not exceed 20 characters" })
      .nonempty({ message: "BILL ID is required" }),
  }
).omit({ shipment_id: true });

export const updateShipmentProductSchema = createInsertSchema(
  shipmentProducts,
  {
    shipment_id: z
      .string()
      .max(20, { message: "Shipment ID must not exceed 20 characters" })
      .optional(),
    bill_id: z
      .string()
      .max(20, { message: "BILL ID must not exceed 20 characters" })
      .optional(),
  }
);
