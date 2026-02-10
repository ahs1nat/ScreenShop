import { sql } from "../db.js";

export async function createCartitemTable() {
    try {
        await sql`
    CREATE TABLE IF NOT EXISTS cart_items (
    cartitem_id SERIAL PRIMARY KEY,
        buyer_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,

        CONSTRAINT fk_cart_buyer
          FOREIGN KEY (buyer_id)
          REFERENCES buyers(buyer_id),

        CONSTRAINT fk_cart_product
          FOREIGN KEY (product_id)
          REFERENCES products(product_id),

        CONSTRAINT uq_cart_buyer_product
          UNIQUE (buyer_id, product_id)
    );
    `;
        console.log("DB cart_items table created successfully");
    } catch (error) {
        console.log("Error creating cart_items in initDB: ", error);
        process.exit(1);
    }
}