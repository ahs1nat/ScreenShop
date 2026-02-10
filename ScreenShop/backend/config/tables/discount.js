import { sql } from "../db.js";

export async function createDiscountTable() {
    try {
        await sql`
    CREATE TABLE IF NOT EXISTS discount (
    discount_id SERIAL PRIMARY KEY,
        type_id INT NOT NULL,
        name VARCHAR(150) NOT NULL,
        discount_value INT NOT NULL CHECK (discount_value > 0),
        start_date TIMESTAMP NOT NULL DEFAULT NOW(),
        end_date TIMESTAMP NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT FALSE,

        CONSTRAINT fk_discount_type
          FOREIGN KEY (type_id)
          REFERENCES discount_type(type_id)
    );
    `;
        console.log("DB discount table created successfully");
    } catch (error) {
        console.log("Error creating discount in initDB: ", error);
        process.exit(1);
    }
}