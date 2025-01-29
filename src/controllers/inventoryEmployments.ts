import { desc, eq } from "drizzle-orm";
import { Request, RequestHandler, Response } from "express";
import { z } from "zod";
import { db } from "../database/connection";
import {
  insertInventoryEmploymentSchema,
  inventoryEmployments,
  updateInventoryEmploymentSchema,
} from "../schemas/index";
import { activeEmpTracker, findUserByIdAndRole } from "../services/index";

export const inventoryEmploymentsController = {
  create: (async (req: Request, res: Response) => {
    try {
      const { employee_id, inventory, hire_date } = req.body;
      await insertInventoryEmploymentSchema.parseAsync({
        employee_id,
        inventory,
        hire_date,
      });

      const userHasPermission = await findUserByIdAndRole(
        employee_id,
        "inventory-in-charge"
      );
      if (!userHasPermission) {
        return res.status(403).json({
          message:
            "Employee does not have permissions to associate with inventory.",
        });
      }

      const activeAssignment = await activeEmpTracker(inventory);
      if (activeAssignment) {
        return res.status(409).json({
          message:
            "An active employee is already associated with this inventory. Please check the assignment.",
        });
      }

      const [newAssignment] = await db
        .insert(inventoryEmployments)
        .values({
          employee_id,
          inventory,
          hire_date,
          employee_status: true,
        })
        .returning();
      if (!newAssignment) {
        return res.status(409).json({
          message:
            "An error occurred while creating the inventory assignment. Please try again.",
        });
      }

      res.status(201).json({
        message: "Inventory assignment created successfully.",
        assignment: newAssignment,
      });
    } catch (error) {
      console.error(
        "An error occurred while creating the employee assignment:",
        error
      );

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }

      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while creating the employee assignment. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
  retrieveAll: (async (req: Request, res: Response) => {
    try {
      const allAssignments = await db.query.inventoryEmployments.findMany({
        orderBy: [desc(inventoryEmployments.created_at)],
        columns: {
          employee_id: false,
        },
        with: {
          employee: {
            columns: {
              id: false,
              password: false,
              last_login_at: false,
              login_count: false,
              failed_login_attempt_count: false,
              failed_login_attempt_last_at: false,
              reset_password_token: false,
              reset_password_token_expired_at: false,
              created_by: false,
            },
            with: {
              creator: {
                columns: {
                  id: false,
                  password: false,
                  national_id: false,
                  driving_license_no: false,
                  passport_no: false,
                  last_login_at: false,
                  login_count: false,
                  failed_login_attempt_count: false,
                  failed_login_attempt_last_at: false,
                  reset_password_token: false,
                  reset_password_token_expired_at: false,
                  created_by: false,
                  created_at: false,
                  updated_at: false,
                },
              },
            },
          },
        },
      });
      res.status(200).json({
        message:
          "All inventories with associated employees retrieved successfully.",
        assignments: allAssignments,
      });
    } catch (error) {
      console.error(
        "An error occurred while retrieving all inventories with associated employees:",
        error
      );
      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while retrieving all inventories with associated employees. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
  retrieveById: (async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const assignment = await db.query.inventoryEmployments.findFirst({
        where: eq(inventoryEmployments.id, id),
        orderBy: [desc(inventoryEmployments.created_at)],
        columns: {
          employee_id: false,
        },
        with: {
          employee: {
            columns: {
              id: false,
              password: false,
              last_login_at: false,
              login_count: false,
              failed_login_attempt_count: false,
              failed_login_attempt_last_at: false,
              reset_password_token: false,
              reset_password_token_expired_at: false,
              created_by: false,
            },
            with: {
              creator: {
                columns: {
                  id: false,
                  password: false,
                  national_id: false,
                  driving_license_no: false,
                  passport_no: false,
                  last_login_at: false,
                  login_count: false,
                  failed_login_attempt_count: false,
                  failed_login_attempt_last_at: false,
                  reset_password_token: false,
                  reset_password_token_expired_at: false,
                  created_by: false,
                  created_at: false,
                  updated_at: false,
                },
              },
            },
          },
        },
      });
      if (!assignment) {
        return res.status(404).json({
          message: `Inventory assignment with associated employee not found with the provided ID "${id}". Please verify the ID.`,
        });
      }

      res.status(200).json({
        message:
          "Inventory assignment with associated employee retrieved successfully.",
        assignment,
      });
    } catch (error) {
      console.error(
        "An error occurred while retrieving the inventory assignment:",
        error
      );
      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while retrieving the inventory assignment. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
  updateById: (async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { termination_date, resign_date, transfer_date } = req.body;
      await updateInventoryEmploymentSchema.parseAsync({
        termination_date,
        resign_date,
        transfer_date,
      });

      const [existingAssignment] = await db
        .select()
        .from(inventoryEmployments)
        .where(eq(inventoryEmployments.id, id))
        .limit(1);
      if (!existingAssignment) {
        return res.status(404).json({
          message: `Inventory assignment with associated employee not found with the provided ID "${id}". Please verify the ID.`,
        });
      }

      const {
        termination_date: existingAssignmentTerminationDate,
        resign_date: existingAssignmentResignDate,
        transfer_date: existingAssignmentTransferDate,
      } = existingAssignment;

      const updatedData = {
        termination_date: termination_date
          ? new Date(termination_date).toISOString()
          : existingAssignmentTerminationDate,
        resign_date: resign_date
          ? new Date(resign_date).toISOString()
          : existingAssignmentResignDate,
        transfer_date: transfer_date
          ? new Date(transfer_date).toISOString()
          : existingAssignmentTransferDate,
        updated_at: new Date().toISOString(),
        employee_status: false,
      };

      const [updatedAssignment] = await db
        .update(inventoryEmployments)
        .set(updatedData)
        .where(eq(inventoryEmployments.id, id))
        .returning();

      if (!updatedAssignment) {
        return res.status(409).json({
          message:
            "An error occurred while updating the inventory assignment. Please try again.",
        });
      }

      res.status(200).json({
        message: "Inventory assignment updated successfully.",
        assignment: updatedAssignment,
      });
    } catch (error) {
      console.error(
        "An error occurred while updating inventory assignment:",
        error
      );

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while updating the inventory assignment. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
  deleteById: (async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const [deletedAssignment] = await db
        .delete(inventoryEmployments)
        .where(eq(inventoryEmployments.id, id))
        .returning();

      if (!deletedAssignment) {
        return res.status(404).json({
          message: `Inventory assignment with associated employee not found with the provided ID "${id}". Please verify the ID.`,
        });
      }

      res.status(200).json({
        message: "Inventory assignment deleted successfully.",
      });
    } catch (error) {
      console.error(
        "An error occurred while deleting inventory assignment:",
        error
      );
      if (error instanceof Error) {
        res.status(500).json({
          message:
            "An unexpected error occurred while deleting the inventory assignment. Please try again.",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
};
