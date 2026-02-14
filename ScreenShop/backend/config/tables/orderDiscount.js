import { sql } from "../db.js";

export async function createOrderDiscountTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS order_discounts (
        order_id INT NOT NULL,
        discount_id INT NOT NULL,

        CONSTRAINT pk_order_discount
          PRIMARY KEY (order_id, discount_id),

        CONSTRAINT fk_od_order
          FOREIGN KEY (order_id)
          REFERENCES orders(order_id)
          ON DELETE CASCADE,

        CONSTRAINT fk_od_discount
          FOREIGN KEY (discount_id)
          REFERENCES discount(discount_id)
          ON DELETE CASCADE
      );
    `;
    console.log("DB order_discounts table created successfully");
  } catch (error) {
    console.error("Error creating order_discounts in initDB: ", error);
    process.exit(1);
  }
}
