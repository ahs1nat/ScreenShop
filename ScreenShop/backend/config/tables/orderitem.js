import { sql } from "../db.js";

export async function createOrderitemTable() {
    try {
        await sql`
    CREATE TABLE IF NOT EXISTS order_items (
    order_item_id SERIAL PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,

        CONSTRAINT fk_orderitem_order
          FOREIGN KEY (order_id)
          REFERENCES orders(order_id)
          ON DELETE CASCADE,

        CONSTRAINT fk_orderitem_product
          FOREIGN KEY (product_id)
          REFERENCES products(product_id)
    );
    `;
        console.log("DB order_items table created successfully");
    } catch (error) {
        console.log("Error creating order_items in initDB: ", error);
        process.exit(1);
    }
}