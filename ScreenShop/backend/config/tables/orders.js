import { sql } from "../db.js";

export async function createOrdersTable() {
  try {
    await sql`
    CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
        buyer_id INT NOT NULL,
        status VARCHAR(20) NOT NULL
          CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
        total_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),

        CONSTRAINT fk_order_buyer
          FOREIGN KEY (buyer_id)
          REFERENCES buyers(buyer_id)
          ON DELETE CASCADE
    );
    `;
    console.log("DB orders table created successfully");
  } catch (error) {
    console.log("Error creating orders in initDB: ", error);
    process.exit(1);
  }
}