"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const serverless_1 = require("@neondatabase/serverless");
require("dotenv/config");
const neon_serverless_1 = require("drizzle-orm/neon-serverless");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const ws_1 = __importDefault(require("ws"));
const schema = __importStar(require("../schemas/index"));
serverless_1.neonConfig.webSocketConstructor = ws_1.default;
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("No database connection string found.");
}
function getDrizzleClient() {
    if (process.env.NODE_ENV === "production") {
        const connection = (0, postgres_1.default)(connectionString, { ssl: true });
        return (0, postgres_js_1.drizzle)(connection, { schema, logger: true });
    }
    else if (process.env.NODE_ENV === "development") {
        if (!global._db) {
            const connection = new serverless_1.Pool({ connectionString });
            global._db = (0, neon_serverless_1.drizzle)(connection, { schema, logger: false });
        }
        return global._db;
    }
    else {
        throw new Error("NODE_ENV must be either 'production' or 'development'.");
    }
}
exports.db = getDrizzleClient();
