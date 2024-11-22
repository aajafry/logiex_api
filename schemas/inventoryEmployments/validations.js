import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { inventoryEmployments } from "../index.js";

export const insertInventoryEmploymentSchema = createInsertSchema(
  inventoryEmployments,
  {
    hire_date: z.coerce.date({ message: "Invalid date" }).optional(),
    employee_id: z
      .string({
        required_error: "Employee ID is required",
      })
      .uuid({ message: "Invalid employee ID" }),
    inventory: z
      .string({
        required_error: "Inventory name is required",
      })
      .max(80, { message: "Inventory name must not exceed 80 characters" })
      .nonempty({ message: "Inventory name is required" }),
  }
);

export const updateInventoryEmploymentSchema = createInsertSchema(
  inventoryEmployments,
  {
    transfer_date: z.coerce.date({ message: "Invalid date" }).optional(),
    resign_date: z.coerce.date({ message: "Invalid date" }).optional(),
    termination_date: z.coerce.date({ message: "Invalid date" }).optional(),
  }
).pick({
  employee_id: false,
  inventory: false,
  hire_date: true,
  resign_date: true,
  termination_date: true,
});
