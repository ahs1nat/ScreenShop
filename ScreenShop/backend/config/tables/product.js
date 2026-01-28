import { sql } from "../db.js";

export async function createProductTable() {
    try {
        await sql`
    CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
        seller_id INT NOT NULL,
        category_id INT NOT NULL,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        price DECIMAL(10,2) NOT NULL,
        quantity INT NOT NULL,
        approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),

        CONSTRAINT fk_product_seller
          FOREIGN KEY (seller_id)
          REFERENCES sellers(seller_id),

        CONSTRAINT fk_product_category
          FOREIGN KEY (category_id)
          REFERENCES product_category(category_id)
    );
    `;
        console.log("DB products table created successfully");
    } catch (error) {
        console.log("Error creating products in initDB: ", error);
        process.exit(1);
    }
}