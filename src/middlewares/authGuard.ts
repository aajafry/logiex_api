import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET as string;

if (!jwtSecret) throw new Error("JWT_SECRET environment variable is not set");

export const authGuard = (roles: string[]) => {
  return ((req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (
      typeof authorization !== "string" ||
      !authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Missing or invalid authorization token",
      });
    }

    const token = authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      if (!decoded)
        return res.status(401).json({
          message: "Invalid token",
        });

      const { id, name, email, role, avatar } = decoded as {
        id: string;
        name: string;
        email: string;
        role: string;
        avatar?: string;
      };

      if (roles && roles.includes(role)) {
        req.user = { id, name, email, role, avatar };
        return next();
      } else {
        return res.status(403).json({
          message: "Access denied: insufficient role permissions.",
        });
      }
    } catch (error) {
      console.error("Authentication error:", (error as Error).message);

      const statusCode =
        (error as jwt.JsonWebTokenError).name === "TokenExpiredError"
          ? 401
          : 403;
      const message =
        (error as jwt.JsonWebTokenError).name === "TokenExpiredError"
          ? "Token has expired."
          : "Authentication failed.";

      return res.status(statusCode).json({
        message,
      });
    }
  }) as RequestHandler;
};
