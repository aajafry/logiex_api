import bcrypt from "bcrypt";
import { eq, ilike, and, gte } from "drizzle-orm";
import { z } from "zod";
import { db } from "../database/connection.js";
import {
  loginUserSchema,
  registerUserSchema,
  verifyEmailUserSchema,
  resetPasswordUserSchema,
  users,
} from "../schemas/index.js";
import { findUserByEmail, findUserWithRole } from "../services/index.js";
import {
  generateToken,
  hashPassword,
  userRolesEnum,
  sendEmail,
} from "../utils/index.js";

export const authController = {
  register: async (req, res) => {
    try {
      await registerUserSchema.parseAsync(req.body);
      const { name, email, password } = req.body;

      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          message: `A user with the email "${email}" already exists. Please use a different email.`,
        });
      }

      const hashedPassword = await hashPassword(password);

      const [newUser] = await db
        .insert(users)
        .values({
          name,
          email,
          password: hashedPassword,
          role: "admin",
        })
        .returning();
      if (!newUser) {
        return res.status(409).json({
          message: `An error occurred while registering the user "${name}". Please try again.`,
        });
      }

      res.status(201).json({
        message: `User "${name}" has been registered successfully`,
        user: newUser,
      });
    } catch (error) {
      console.error("An error occurred while registering user:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while registering the user. Please try again.",
        error: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      await loginUserSchema.parseAsync(req.body);
      const { email, password } = req.body;

      const existingUser = await findUserWithRole(email, userRolesEnum);
      if (!existingUser) {
        return res.status(404).json({
          message: "Invalid credentials",
        });
      }

      const {
        id: existingUserId,
        name: existingUserName,
        email: existingUserEmail,
        password: existingUserPassword,
        role: existingUserRole,
        avatar: existingUserAvatar,
        failed_login_attempt_count: existingUserFailedLoginAttemptCount,
        login_count: existingUserLoginCount,
      } = existingUser;

      const isValidPassword = await bcrypt.compare(
        password,
        existingUserPassword
      );
      if (!isValidPassword) {
        await db
          .update(users)
          .set({
            failed_login_attempt_count: existingUserFailedLoginAttemptCount + 1,
            failed_login_attempt_last_at: new Date().toISOString(),
          })
          .where(eq(users.id, existingUserId));

        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      const payload = {
        id: existingUserId,
        name: existingUserName,
        email: existingUserEmail,
        role: existingUserRole,
        avatar: existingUserAvatar,
      };
      const token = generateToken(payload);

      await db
        .update(users)
        .set({
          isOnline: true,
          last_login_at: new Date().toISOString(),
          login_count: existingUserLoginCount + 1,
        })
        .where(eq(users.id, existingUserId))
        .returning();

      res.status(200).json({
        message: `The user "${payload.name}" has been logged in successfully`,
        user: payload,
        token,
      });
    } catch (error) {
      console.error("An error occurred while logging in a user:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while logging in the user. Please try again.",
        error: error.message,
      });
    }
  },
  requestPasswordReset: async (req, res) => {
    try {
      await verifyEmailUserSchema.parseAsync(req.body);
      const { email } = req.body;

      const existingUser = await findUserWithRole(email, userRolesEnum);
      if (!existingUser) {
        return res.status(404).json({
          message: "Invalid credentials",
        });
      }

      const {
        id: existingUserId,
        name: existingUserName,
        email: existingUserEmail,
        role: existingUserRole,
        avatar: existingUserAvatar,
      } = existingUser;

      const payload = {
        id: existingUserId,
        name: existingUserName,
        email: existingUserEmail,
        role: existingUserRole,
        avatar: existingUserAvatar,
      };
      const token = generateToken(payload);

      await db
        .update(users)
        .set({
          reset_password_token: token,
          reset_password_token_expired_at: new Date(
            new Date().getTime() + 10 * 60 * 1000
          ).toISOString(), // 10 minutes
        })
        .where(eq(users.id, existingUserId))
        .returning();

      const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
      await sendEmail(
        email,
        "Password Reset Request",
        `Click here to reset your password: ${resetLink}`
      );

      res.status(200).json({
        message: `A password reset link has been sent to "${email}".`,
      });
    } catch (error) {
      console.error(
        "An error occurred while requesting password reset:",
        error
      );
      res.status(500).json({
        message:
          "An unexpected error occurred while requesting the password reset. Please try again.",
        error: error.message,
      });
    }
  },
  resetPassword: async (req, res) => {
    try {
      await resetPasswordUserSchema.parseAsync(req.body);
      const { reset_password_token: resetToken, password } = req.body;

      const [existingUser] = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.reset_password_token, resetToken),
            gte(users.reset_password_token_expired_at, new Date().toISOString())
          )
        );
      if (!existingUser) {
        return res.status(404).json({
          message: "Invalid credentials",
        });
      }

      const { id: existingUserId } = existingUser;

      const hashedPassword = await hashPassword(password);

      const [updateUserWithPassword] = await db
        .update(users)
        .set({
          password: hashedPassword,
          reset_password_token: null,
          reset_password_token_expired_at: null,
          updated_at: new Date().toISOString(),
        })
        .where(eq(users.id, existingUserId))
        .returning();
      if (!updateUserWithPassword) {
        return res.status(409).json({
          message:
            "An error occurred while updating the password. Please try again.",
        });
      }

      const {
        id: updatedUserId,
        name: updatedUserName,
        email: updatedUserEmail,
        role: updatedUserRole,
        avatar: updatedUserAvatar,
      } = updateUserWithPassword;

      const payload = {
        id: updatedUserId,
        name: updatedUserName,
        email: updatedUserEmail,
        role: updatedUserRole,
        avatar: updatedUserAvatar,
      };

      res.status(200).json({
        message: "Password reset successful",
        user: payload,
      });
    } catch (error) {
      console.error("An error occurred while resetting password:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while resetting the password. Please try again.",
        error: error.message,
      });
    }
  },
  logout: async (req, res) => {
    try {
      const { id } = req.params;

      const [logoutUser] = await db
        .update(users)
        .set({
          isOnline: false,
        })
        .where(eq(users.id, id))
        .returning();
      if (!logoutUser) {
        return res.status(404).json({
          message: `No user found with the provided ID "${id}". Please verify and try again.`,
        });
      }

      res.status(200).json({
        message: `The user "${logoutUser.name}" has been logged out successfully`,
      });
    } catch (error) {
      console.error("An error occurred while logging out a user:", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while logging out the user. Please try again.",
        error: error.message,
      });
    }
  },
};
