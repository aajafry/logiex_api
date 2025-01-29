import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

export const jwtSecret = process.env.JWT_SECRET as string;
export const tokenExpiry = process.env.TOKEN_EXPIRY as StringValue | number;

export const generateToken = (payload: object) => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: tokenExpiry,
  });
};
