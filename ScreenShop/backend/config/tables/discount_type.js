import { sql } from "../db.js";

export async function createDiscountTypeTable() {
    try {
        await sql`
    CREATE TABLE IF NOT EXISTS discount_type (
    type_id SERIAL PRIMARY KEY,
        type_name VARCHAR(100) NOT NULL,
        description TEXT
    );
    `;
        console.log("DB discount_type table created successfully");
    } catch (error) {
        console.log("Error creating discount_type in initDB: ", error);
        process.exit(1);
    }
}