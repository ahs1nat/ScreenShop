import { sql } from "../db.js";

export async function createProductCategoryTable() {
    try {
        await sql`
    CREATE TABLE IF NOT EXISTS product_category (
    category_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );
    `;
        console.log("DB product_category table created successfully");
    } catch (error) {
        console.log("Error creating product_category in initDB: ", error);
        process.exit(1);
    }
}