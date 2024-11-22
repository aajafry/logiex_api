import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) throw new Error("JWT_SECRET environment variable is not set");

/**
 * Middleware to check JWT and validate user roles.
 * @param {Array<string>} roles - Array of roles that are allowed access.
 * @returns {Function} Middleware function for Express.
 */

export const authGuard = (roles) => {
  return (req, res, next) => {
    const { authorization } = req.headers;

    if (
      typeof authorization !== "string" ||
      !authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "missing or invalid authorization token",
      });
    }

    const token = authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, jwtSecret);

      if (!decoded)
        return res.status(401).json({
          message: "invalid token",
        });

      const { id, name, email, role, avatar } = decoded;

      if (roles && roles.includes(role)) {
        req.user = { id, name, email, role, avatar };
        return next();
      } else {
        return res.status(403).json({
          message: "access denied: insufficient role permissions.",
        });
      }
    } catch (error) {
      console.error("authentication error:", error.message);

      const statusCode = error.name === "TokenExpiredError" ? 401 : 403;
      const message =
        error.name === "TokenExpiredError"
          ? "Token has expired."
          : "Authentication failed.";

      return res.status(statusCode).json({
        message,
      });
    }
  };
};
