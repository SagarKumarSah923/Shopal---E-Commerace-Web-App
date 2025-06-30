import express from "express";
import "reflect-metadata";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

// MongoDB
import connectDB from "./utils/connectDB";
connectDB();

// Middlewares
import corsMiddleware from "./middlewares/cors.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

// Routers
import UserRouter from "@/api/users/user.router";
import AuthRouter from "@/api/auth/auth.router";
import OrderRouter from "@/api/orders/order.router";
import CartRouter from "@/api/carts/carts.router";
import ReviewRouter from "@/api/reviews/review.router";
import ProductRouter from "@/api/products/product.router";

// App setup
const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(
  process.env.NODE_ENV === "production"
    ? cors({ origin: process.env.CLIENT_PROD_URL, credentials: true })
    : corsMiddleware
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/user", UserRouter);
app.use("/auth", AuthRouter);
app.use("/order", OrderRouter);
app.use("/cart", CartRouter);
app.use("/review", ReviewRouter);
app.use("/product", ProductRouter);

// Error handler
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
