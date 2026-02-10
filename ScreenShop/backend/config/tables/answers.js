import { sql } from "../db.js";

export async function createAnswersTable() {
    try {
        await sql`
    CREATE TABLE IF NOT EXISTS answers (
    answer_id SERIAL PRIMARY KEY,
        question_id INT NOT NULL UNIQUE,
        seller_id INT NOT NULL,
        answer_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),

        CONSTRAINT fk_answer_question
          FOREIGN KEY (question_id)
          REFERENCES questions(question_id)
          ON DELETE CASCADE,

        CONSTRAINT fk_answer_seller
          FOREIGN KEY (seller_id)
          REFERENCES sellers(seller_id)
          ON DELETE CASCADE
    );
    `;
        console.log("DB answers table created successfully");
    } catch (error) {
        console.log("Error creating answers in initDB: ", error);
        process.exit(1);
    }
}