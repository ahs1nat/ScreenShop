import { sql } from "../db.js";

export async function createQuestionsTable() {
    try {
        await sql`
    CREATE TABLE IF NOT EXISTS questions (
    question_id SERIAL PRIMARY KEY,
        product_id INT NOT NULL,
        buyer_id INT NOT NULL,
        question_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),

        CONSTRAINT fk_question_product
          FOREIGN KEY (product_id)
          REFERENCES products(product_id)
          ON DELETE CASCADE,

        CONSTRAINT fk_question_buyer
          FOREIGN KEY (buyer_id)
          REFERENCES buyers(buyer_id)
          ON DELETE CASCADE
    );
    `;
        console.log("DB questions table created successfully");
    } catch (error) {
        console.log("Error creating questions in initDB: ", error);
        process.exit(1);
    }
}