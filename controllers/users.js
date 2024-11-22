import { eq, ilike, or, inArray, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "../database/connection.js";
import { insertUserSchema, updateUserSchema, users } from "../schemas/index.js";
import { findUserByEmail, findUserByPhone } from "../services/index.js";
import { hashPassword } from "../utils/index.js";

export const usersController = {
  create: async (req, res) => {
    try {
      await insertUserSchema.parseAsync(req.body);
      const { name, email, phone, password } = req.body;

      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          message: `A user with the email "${email}" already exists. Please use a different email.`,
        });
      }

      if (phone) {
        const existingUser = await findUserByPhone(phone);
        if (existingUser) {
          return res.status(409).json({
            message: `A user with the phone number "${phone}" already exists. Please use a different phone number.`,
          });
        }
      }

      const hashedPassword = await hashPassword(password);

      const [newUser] = await db
        .insert(users)
        .values({
          ...req.body,
          password: hashedPassword,
          created_by: req.user.id,
        })
        .returning();

      if (!newUser) {
        return res.status(409).json({
          message: `An error occurred while creating the user "${name}". Please try again.`,
        });
      }

      res.status(201).json({
        message: `The user "${name}" has been created successfully`,
        user: newUser,
      });
    } catch (error) {
      console.error("An error occurred while creating user", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while creating the user. Please try again.",
        error: error.message,
      });
    }
  },
  retrieveAll: async (req, res) => {
    const { role } = req.user;
    try {
      let allUsers;
      if (role === "admin") {
        allUsers = await db.query.users.findMany({
          orderBy: [desc(users.created_at)],
          columns: {
            password: false,
            created_by: false,
            reset_password_token: false,
            reset_password_token_expired_at: false,
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
            inventoryInCharges: {
              columns: {
                id: false,
                employee_id: false,
              },
            },
            captains: {
              columns: {
                id: false,
                captain_id: false,
                vehicle_id: false,
              },
              with: {
                vehicle: {
                  columns: {
                    id: false,
                  },
                },
              },
            },
          },
        });
      } else if (role === "inventory-manager") {
        allUsers = await db.query.users.findMany({
          where: inArray(users.role, ["inventory-in-charge", "captain"]),
          columns: {
            password: false,
            created_by: false,
            reset_password_token: false,
            reset_password_token_expired_at: false,
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
            inventoryInCharges: {
              columns: {
                id: false,
                employee_id: false,
              },
            },
            captains: {
              columns: {
                id: false,
                captain_id: false,
                vehicle_id: false,
              },
              with: {
                vehicle: {
                  columns: {
                    id: false,
                  },
                },
              },
            },
          },
        });
      } else if (role === "fleet-manager") {
        allUsers = await db.query.users.findMany({
          where: eq(users.role, "captain"),
          columns: {
            password: false,
            created_by: false,
            reset_password_token: false,
            reset_password_token_expired_at: false,
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
            inventoryInCharges: {
              columns: {
                id: false,
                employee_id: false,
              },
            },
            captains: {
              columns: {
                id: false,
                captain_id: false,
                vehicle_id: false,
              },
              with: {
                vehicle: {
                  columns: {
                    id: false,
                  },
                },
              },
            },
          },
        });
      } else {
        allUsers = await db.query.users.findMany({
          where: eq(users.role, "captain"),
          columns: {
            password: false,
            created_by: false,
            reset_password_token: false,
            reset_password_token_expired_at: false,
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
            inventoryInCharges: {
              columns: {
                id: false,
                employee_id: false,
              },
            },
            captains: {
              columns: {
                id: false,
                captain_id: false,
                vehicle_id: false,
              },
              with: {
                vehicle: {
                  columns: {
                    id: false,
                  },
                },
              },
            },
          },
        });
      }
      res.status(200).json({
        message: "Users retrieved successfully",
        users: allUsers,
      });
    } catch (error) {
      console.error("An error occurred while retrieving users", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving users. Please try again.",
        error: error.message,
      });
    }
  },
  retrieveById: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
        orderBy: [desc(users.created_at)],
        columns: {
          password: false,
          created_by: false,
          reset_password_token: false,
          reset_password_token_expired_at: false,
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
          inventoryInCharges: {
            columns: {
              id: false,
              employee_id: false,
            },
          },
          captains: {
            columns: {
              id: false,
              captain_id: false,
              vehicle_id: false,
            },
            with: {
              vehicle: {
                columns: {
                  id: false,
                },
              },
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          message: `No user found with the provided ID "${id}". Please verify the ID and try again.`,
        });
      }
      res.status(200).json({
        message: "User retrieved successfully",
        user,
      });
    } catch (error) {
      console.error("An error occurred while retrieving user", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving the user. Please try again.",
        error: error.message,
      });
    }
  },
  updateById: async (req, res) => {
    try {
      await updateUserSchema.parseAsync(req.body);
      const { id } = req.params;
      const {
        name,
        email,
        phone,
        avatar,
        address,
        password,
        role,
        national_id,
        driving_license,
        passport_no,
      } = req.body;

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      if (!existingUser) {
        return res.status(404).json({
          message: `No user found with the provided ID "${id}". Please verify the ID and try again.`,
        });
      }

      const {
        name: existingUserName,
        email: existingUserEmail,
        phone: existingUserPhone,
        avatar: existingUserAvatar,
        address: existingUserAddress,
        password: existingUserPassword,
        role: existingUserRole,
        national_id: existingUserNationalId,
        driving_license: existingUserDrivingLicense,
        passport_no: existingUserPassportNo,
      } = existingUser;

      if (email && email !== existingUserEmail) {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
          return res.status(409).json({
            message: `A user with the email "${email}" already exists. Please use a different email.`,
          });
        }
      }
      if (phone && phone !== existingUserPhone) {
        const existingUser = await findUserByPhone(phone);

        if (existingUser) {
          return res.status(409).json({
            message: `A user with the phone number "${phone} already exists. Please use a different phone number.`,
          });
        }
      }

      const hashedPassword = password
        ? await hashPassword(password)
        : existingUserPassword;

      const updatedData = {
        name: name || existingUserName,
        email: email || existingUserEmail,
        phone: phone || existingUserPhone,
        avatar: avatar || existingUserAvatar,
        address: address || existingUserAddress,
        password: hashedPassword,
        role: role || existingUserRole,
        national_id: national_id || existingUserNationalId,
        driving_license_no: driving_license || existingUserDrivingLicense,
        passport_no: passport_no || existingUserPassportNo,
        updated_at: new Date().toISOString(),
      };

      const [updatedUser] = await db
        .update(users)
        .set(updatedData)
        .where(eq(users.id, id))
        .returning();

      if (!updatedUser) {
        return res.status(404).json({
          message: `An error occurred while updating the user "${existingUserName}". Please try again.`,
        });
      }
      res.status(200).json({
        message: `The user ${existingUserName} has been updated successfully`,
        user: updatedUser,
      });
    } catch (error) {
      console.error("An error occurred while updating user", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while updating the user. Please try again.",
        error: error.message,
      });
    }
  },
  deleteById: async (req, res) => {
    try {
      const { id } = req.params;
      const [deletedUser] = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning();
      if (!deletedUser) {
        return res.status(404).json({
          message: `No user found with the provided ID "${id}". Please verify the ID and try again.`,
        });
      }

      res.status(200).json({
        message: `The user "${deletedUser.name}" has been deleted successfully`,
      });
    } catch (error) {
      console.error("An error occurred while deleting user", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while deleting the user. Please try again.",
        error: error.message,
      });
    }
  },
};
