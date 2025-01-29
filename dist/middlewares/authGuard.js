"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret)
    throw new Error("JWT_SECRET environment variable is not set");
const authGuard = (roles) => {
    return ((req, res, next) => {
        const { authorization } = req.headers;
        if (typeof authorization !== "string" ||
            !authorization.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Missing or invalid authorization token",
            });
        }
        const token = authorization.split(" ")[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
            if (!decoded)
                return res.status(401).json({
                    message: "Invalid token",
                });
            const { id, name, email, role, avatar } = decoded;
            if (roles && roles.includes(role)) {
                req.user = { id, name, email, role, avatar };
                return next();
            }
            else {
                return res.status(403).json({
                    message: "Access denied: insufficient role permissions.",
                });
            }
        }
        catch (error) {
            console.error("Authentication error:", error.message);
            const statusCode = error.name === "TokenExpiredError"
                ? 401
                : 403;
            const message = error.name === "TokenExpiredError"
                ? "Token has expired."
                : "Authentication failed.";
            return res.status(statusCode).json({
                message,
            });
        }
    });
};
exports.authGuard = authGuard;
