import { sql } from "../db.js";

export async function createSellersTable() {
    try {
        await sql`
    CREATE TABLE IF NOT EXISTS sellers (
    seller_id INT PRIMARY KEY,
        store_name VARCHAR(150) NOT NULL,
        approved BOOLEAN DEFAULT FALSE,
        CONSTRAINT fk_seller_user
          FOREIGN KEY (seller_id)
          REFERENCES users(user_id)
          ON DELETE CASCADE
    );
    `;
        console.log("DB sellers table created successfully");
    } catch (error) {
        console.log("Error creating sellers in initDB: ", error);
        process.exit(1);
    }
}