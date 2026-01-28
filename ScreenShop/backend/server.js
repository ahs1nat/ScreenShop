import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv"
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log(PORT);

app.use(express.json());
app.use(cors());
app.use(helmet()); // helmet = security middleware
app.use(morgan("dev")); // log the requests
app.get("/test", (req, res) => {
    res.send("Hello from  finally " + PORT);
});

app.use("/api/products", productRoutes);


async function initDB() {
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('buyer', 'seller')),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
        console.log("DB init success");
    } catch (error) {
        console.log("Error initDB: ", error);
        process.exit(1);
    }
}
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

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port " + PORT);
    });
});