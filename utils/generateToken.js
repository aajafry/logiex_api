import jwt from "jsonwebtoken";

export const jwtSecret = process.env.JWT_SECRET;
export const tokenExpiry = process.env.TOKEN_EXPIRY;

export const generateToken = (payload) => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: tokenExpiry,
  });
};
