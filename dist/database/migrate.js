"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
const postgres_1 = __importDefault(require("postgres"));
const connection = (0, postgres_1.default)(process.env.DATABASE_URL, { max: 1 });
async function main() {
    await (0, migrator_1.migrate)((0, postgres_js_1.drizzle)(connection), {
        migrationsFolder: "./migrations",
    });
}
main()
    .catch((error) => console.error("error while migration occurs:", error))
    .finally(() => connection.end());
