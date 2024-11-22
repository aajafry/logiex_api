import cors from "cors";
import "dotenv/config";
import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { errorGuard } from "./middlewares/index.js";

import {
  authRouter,
  categoriesRouter,
  customersRouter,
  inventoriesRouter,
  inventoryEmploymentsRouter,
  inventoryProductsRouter,
  transfersRouter,
  productsRouter,
  purchaseProductsRouter,
  purchasesRouter,
  saleProductsRouter,
  salesRouter,
  shipmentProductsRouter,
  shipmentsRouter,
  usersRouter,
  vehiclesRouter,
  vendorsRouter,
  transferProductsRouter,
  cloudinaryRouter,
} from "./routes/index.js";

const app = express();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 200,
  message:
    "too many requests from this IP, please try again later after one hours.",
  legacyHeaders: true,
  skip: (req) => req.method === "GET",
});

app.use(cors());
// app.use(limiter);
// app.use(helmet());
// app.use(morgan("dev")); // combined for production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the logiEx API!");
});

app.use("/auth", authRouter);
app.use("/categories", categoriesRouter);
app.use("/vendors", vendorsRouter);
app.use("/customers", customersRouter);
app.use("/inventories", inventoriesRouter);
app.use("/inventory-employments", inventoryEmploymentsRouter);
app.use("/inventory-products", inventoryProductsRouter);
app.use("/transfers", transfersRouter);
app.use("/transfer-products", transferProductsRouter);
app.use("/sale-products", saleProductsRouter);
app.use("/sales", salesRouter);
app.use("/products", productsRouter);
app.use("/purchases", purchasesRouter);
app.use("/purchase-products", purchaseProductsRouter);
app.use("/shipment-products", shipmentProductsRouter);
app.use("/shipments", shipmentsRouter);
app.use("/users", usersRouter);
app.use("/vehicles", vehiclesRouter);
app.use("/cloudinary", cloudinaryRouter);

app.use(errorGuard);

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`logiEx server listening on http://localhost:${port}`)
);
