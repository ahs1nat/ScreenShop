import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewsRouter from "./routes/reviewsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import buyerRoutes from "./routes/buyerRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import discountTypeRoutes from "./routes/discountTypeRoutes.js";

//import { sql } from "./config/db.js";

import { initDB } from "./config/init.js";
import { seed } from "./seeds/seed.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log(PORT);

app.use(express.json()); 
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));


app.get("/test", (req, res) => {
  res.send("Hello from " + PORT);
});

app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewsRouter);
app.use("/api/discount-types", discountTypeRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/questions", questionRoutes);

app.use("/api/auth", authRoutes);

async function startServer() {
  try { 
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Critical Startup Error:", error.message);
    process.exit(1);
  }
}

startServer();