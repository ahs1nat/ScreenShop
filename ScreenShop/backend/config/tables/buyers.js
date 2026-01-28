import { sql } from "../db.js";

export async function createBuyersTable() {
    try {
        await sql`
    CREATE TABLE IF NOT EXISTS buyers (
    buyer_id INT PRIMARY KEY,
        phone VARCHAR(20) NOT NULL,
        address VARCHAR(255),
        CONSTRAINT fk_buyer_user
          FOREIGN KEY (buyer_id)
          REFERENCES users(user_id)
          ON DELETE CASCADE
    );
    `;
        console.log("DB buyers table created successfully");
    } catch (error) {
        console.log("Error creating buyers in initDB: ", error);
        process.exit(1);
    }
}