import { sql } from "../db.js";

export async function createBuyersTable() {
    try {
        //await sql`DROP TABLE IF EXISTS buyers CASCADE;`
        await sql`
    CREATE TABLE IF NOT EXISTS buyers (
    buyer_id INT PRIMARY KEY,
        address VARCHAR(255) NOT NULL,
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