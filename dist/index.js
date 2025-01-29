"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_rate_limit_1 = require("express-rate-limit");
const express_1 = __importDefault(require("express"));
const index_1 = require("./middlewares/index");
const index_2 = require("./routes/index");
const app = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 10 * 60 * 1000,
    limit: 200,
    message: "too many requests from this IP, please try again later after one hours.",
    legacyHeaders: true,
    skip: (req) => req.method === "GET",
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Welcome to the logiEx API!");
});
app.use("/auth", index_2.authRouter);
app.use("/categories", index_2.categoriesRouter);
app.use("/vendors", index_2.vendorsRouter);
app.use("/customers", index_2.customersRouter);
app.use("/inventories", index_2.inventoriesRouter);
app.use("/inventory-employments", index_2.inventoryEmploymentsRouter);
app.use("/inventory-products", index_2.inventoryProductsRouter);
app.use("/transfers", index_2.transfersRouter);
app.use("/transfer-products", index_2.transferProductsRouter);
app.use("/sale-products", index_2.saleProductsRouter);
app.use("/sales", index_2.salesRouter);
app.use("/products", index_2.productsRouter);
app.use("/purchases", index_2.purchasesRouter);
app.use("/purchase-products", index_2.purchaseProductsRouter);
app.use("/shipment-products", index_2.shipmentProductsRouter);
app.use("/shipments", index_2.shipmentsRouter);
app.use("/users", index_2.usersRouter);
app.use("/vehicles", index_2.vehiclesRouter);
app.use("/cloudinary", index_2.cloudinaryRouter);
app.all("*", (req, res) => {
    res.status(404).json({
        message: `API endpoint ${req.originalUrl} not found.\n Please verify the URL.`,
    });
});
app.use(index_1.errorGuard);
const port = (process.env.PORT || 3000);
app.listen(port, () => console.log(`logiEx server listening on http://localhost:${port}`));
