import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "../database/connection";
import {
  customers,
  insertCustomerSchema,
  updateCustomerSchema,
} from "../schemas/index";
import {
  findCustomerByPhone,
  findCustomerByEmail,
  findCustomerById,
} from "../services/index";
import { Request, Response, RequestHandler } from "express";

export const customersController = {
  create: (async (req: Request, res: Response) => {
    try {
      await insertCustomerSchema.parseAsync(req.body);
      const { name, email, phone } = req.body;

      if (email) {
        const existingCustomer = await findCustomerByEmail(email);
        if (existingCustomer) {
          return res.status(409).json({
            message: `A customer with the email "${email}" already exists. Please use a different email.`,
          });
        }
      }
      if (phone) {
        const existingCustomer = await findCustomerByPhone(phone);
        if (existingCustomer) {
          return res.status(409).json({
            message: `A customer with the phone number "${phone}" already exists. Please use a different phone number.`,
          });
        }
      }

      const [newCustomer] = await db
        .insert(customers)
        .values({ ...req.body })
        .returning();
      if (!newCustomer) {
        return res.status(409).json({
          message: `An error occurred while creating the customer "${name}". Please try again.`,
        });
      }

      res.status(201).json({
        message: `The customer "${name}" has been created successfully.`,
        customer: newCustomer,
      });
    } catch (error) {
      console.error("An error occurred while creating customer:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }

      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while creating the customer. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
  retrieveAll: (async (req: Request, res: Response) => {
    try {
      const allCustomers = await db.query.customers.findMany({
        orderBy: [desc(customers.created_at)],
        with: {
          orders: {
            columns: {
              id: false,
              customer_id: false,
            },
          },
        },
      });

      res.status(200).json({
        message: "Customers retrieved successfully.",
        customers: allCustomers,
      });
    } catch (error) {
      console.error("An error occurred while retrieving customers:", error);
      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An error occurred while retrieving customers. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
  retrieveById: (async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const customer = await db.query.customers.findFirst({
        where: eq(customers.id, id),
        orderBy: [desc(customers.created_at)],
        with: {
          orders: {
            columns: {
              id: false,
              customer_id: false,
            },
          },
        },
      });

      if (!customer) {
        return res.status(404).json({
          message: `No customer found with the provided ID "${id}". Please verify the ID and try again.`,
        });
      }

      res.status(200).json({
        message: "Customer retrieved successfully",
        customer,
      });
    } catch (error) {
      console.error("An error occurred while retrieving customer:", error);

      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while retrieving the customer. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
  updateById: (async (req: Request, res: Response) => {
    try {
      await updateCustomerSchema.parseAsync(req.body);
      const { id } = req.params;
      const { name, email, phone, address } = req.body;

      const existingCustomer = await findCustomerById(id);
      if (!existingCustomer) {
        return res.status(404).json({
          message: `No customers found with the provided ID "${id}". Please verify the ID and try again.`,
        });
      }

      const {
        name: existingCustomerName,
        email: existingCustomerEmail,
        phone: existingCustomerPhone,
        address: existingCustomerAddress,
      } = existingCustomer;

      if (email && email !== existingCustomerEmail) {
        const existingCustomer = await findCustomerByEmail(email);
        if (existingCustomer) {
          return res.status(409).json({
            message: `A customer with the email "${email}" already exists. Please use a different email.`,
          });
        }
      }
      if (phone && phone !== existingCustomerPhone) {
        const existingCustomer = await findCustomerByPhone(phone);
        if (existingCustomer) {
          return res.status(409).json({
            message: `A customer with the phone number "${phone}" already exists. Please use a different phone number.`,
          });
        }
      }

      const updatedData = {
        name: name || existingCustomerName,
        email: email || existingCustomerEmail,
        phone: phone || existingCustomerPhone,
        address: address || existingCustomerAddress,
        updated_at: new Date().toISOString(),
      };
      const [updatedCustomer] = await db
        .update(customers)
        .set(updatedData)
        .where(eq(customers.id, id))
        .returning();

      if (!updatedCustomer) {
        return res.status(404).json({
          message: `An error occurred while updating the customer "${existingCustomerName}". Please try again.`,
        });
      }
      res.status(200).json({
        message: `The customer ${existingCustomerName} has been updated successfully`,
        customer: updatedCustomer,
      });
    } catch (error) {
      console.error("An error occurred while updating customer", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }

      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while updating the customer. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
  deleteById: (async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const [deletedCustomer] = await db
        .delete(customers)
        .where(eq(customers.id, id))
        .returning();
      if (!deletedCustomer) {
        return res.status(404).json({
          message: `No customer found with the provided ID "${id}". Please verify the ID and try again.`,
        });
      }

      res.status(200).json({
        message: `The customer "${deletedCustomer.name}" has been deleted successfully.`,
      });
    } catch (error) {
      console.error("An error occurred while deleting customer by ID:", error);

      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while deleting the customer. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
};
