"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorGuard = void 0;
const errorGuard = (err, req, res, next) => {
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
exports.errorGuard = errorGuard;
