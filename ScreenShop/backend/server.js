import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv"; //loads secret variables(passwords) from .env

//routes
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import buyerRoutes from "./routes/buyerRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";

//import { sql } from "./config/db.js";

import { initDB } from "./config/init.js";
import { seed } from "./seeds/seed.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log(PORT);

//middlewares
app.use(express.json()); //extract json data
//app.use(express.urlencoded({ extended: true }));
//express to automatically post data in html form submissions so that it cant be accessed in req.body

app.use(cors()); //allows react to talk to backend
app.use(helmet()); // helmet = security middleware
app.use(morgan("dev")); // log the requests


app.get("/test", (req, res) => {
  res.send("Hello from " + PORT);
});

app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/questions", questionRoutes);

app.use("/api/auth", authRoutes);

async function startServer() {
  try { 
    // await initDB();
    // console.log("Database Tables Initialized");

    // await seed();
    // console.log("Database Seeded Successfully");
  
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Critical Startup Error:", error.message);
    process.exit(1);
  }
}

startServer();

// async function initDB() {
//     try {
//         await sql`
//       CREATE TABLE IF NOT EXISTS users (
//         user_id SERIAL PRIMARY KEY,
//         name VARCHAR(100) NOT NULL,
//         email VARCHAR(150) NOT NULL UNIQUE,
//         password_hash VARCHAR(255) NOT NULL,
//         role VARCHAR(20) NOT NULL CHECK (role IN ('buyer', 'seller')),
//         created_at TIMESTAMP DEFAULT NOW()
//       );
//     `;
//         console.log("DB init success");
//     } catch (error) {
//         console.log("Error initDB: ", error);
//         process.exit(1);
//     }
// }
// (req,res) =>{
//     // get all products from database

//     res.status(200).json({
//         success: true,
//         data: [
//             {id: 1, name: "Product 1"},
//             {id: 2, name: "Product 2"},
//             {id: 3, name: "Product 3"},
//         ],
//     });
// });

// app.listen(PORT, () => {
//     console.log("Server is running on port " + PORT);
// });

// initDB().then(() => {
//     app.listen(PORT, () => {
//         console.log("Server is running on port " + PORT);
//     });
//     seed();
// });

// Request comes in from React.

// Morgan logs it in your console.

// Helmet adds security headers.

// Express.json reads any data sent.

// Router looks at the URL and sends it to productRoutes.js.

// ProductRoutes talks to PostgreSQL to get data.

// Response is sent back to React.
