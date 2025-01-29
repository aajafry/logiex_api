import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
  status?: number;
  code?: string;
}

export const errorGuard = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack || err.message);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    code: err.code || "UNKNOWN_ERROR",
    error: isProduction ? null : err.stack || err.message,
    timestamp: new Date().toISOString(),
  });
};
