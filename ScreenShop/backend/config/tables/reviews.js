import { sql } from "../db.js";

export async function createReviewsTable() {
    try {
        await sql`
    CREATE TABLE IF NOT EXISTS reviews (
     review_id SERIAL PRIMARY KEY,
        product_id INT NOT NULL,
        buyer_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        review_text TEXT,
        created_at TIMESTAMP DEFAULT NOW(),

        CONSTRAINT fk_review_product
          FOREIGN KEY (product_id)
          REFERENCES products(product_id)
          ON DELETE CASCADE,

        CONSTRAINT fk_review_buyer
          FOREIGN KEY (buyer_id)
          REFERENCES buyers(buyer_id)
          ON DELETE CASCADE,

        CONSTRAINT uq_review_product_buyer
          UNIQUE (product_id, buyer_id)
    );
    `;
        console.log("DB reviews table created successfully");
    } catch (error) {
        console.log("Error creating reviews in initDB: ", error);
        process.exit(1);
    }
}