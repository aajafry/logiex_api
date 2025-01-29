"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.tokenExpiry = exports.jwtSecret = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.jwtSecret = process.env.JWT_SECRET;
exports.tokenExpiry = process.env.TOKEN_EXPIRY;
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, exports.jwtSecret, {
        expiresIn: exports.tokenExpiry,
    });
};
exports.generateToken = generateToken;
