import { sql } from "../db.js";

export async function createProductDiscountTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS product_discounts (
        product_id INT NOT NULL,
        discount_id INT NOT NULL,

        CONSTRAINT pk_product_discount
          PRIMARY KEY (product_id, discount_id),

        CONSTRAINT fk_pd_product
          FOREIGN KEY (product_id)
          REFERENCES products(product_id)
          ON DELETE CASCADE,

        CONSTRAINT fk_pd_discount
          FOREIGN KEY (discount_id)
          REFERENCES discount(discount_id)
          ON DELETE CASCADE
      );
    `;
    console.log("DB product_discounts table created successfully");
  } catch (error) {
    console.error("Error creating product_discounts in initDB: ", error);
    process.exit(1);
  }
}
