import { sql } from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

export async function seed() {
  try {
    console.log("Starting database seed...");

    // 1. Clear existing data
    await sql`TRUNCATE TABLE users, sellers, buyers, products, product_category RESTART IDENTITY CASCADE`;

    const [user] = await sql`
      INSERT INTO users (name, email, password_hash, phone, role)
      VALUES ('Shop_Admin', 'admin@screenshop.com', '$2b$10$fakehash', '0123456678', 'seller')
      RETURNING user_id
    `;


    const [electronics] =
      await sql`INSERT INTO product_category (name) VALUES ('Electronics') RETURNING category_id`;
    const [accessories] =
      await sql`INSERT INTO product_category (name) VALUES ('Accessories') RETURNING category_id`;

    console.log(`Created User with ID: ${user.user_id}`);

    // 3. Create the Seller record (linking it to the User)
    // This satisfies the 1:1 relationship where seller_id = user_id
    const [seller] = await sql`
      INSERT INTO sellers (seller_id, store_name, approved)
      VALUES (${user.user_id}, 'ScreenShop Official', true)
      RETURNING seller_id
    `;

    console.log(`Created Seller with ID: ${seller.seller_id}`);

    // 4. Insert Product Data
    const products = [
      {
        name: "Wireless Headphones",
        desc: "Noise-cancelling.",
        price: 199.99,
        quantity: 50,
        catId: electronics.category_id,
      },
      {
        name: "Smart Watch",
        desc: "Fitness tracker.",
        price: 149.5,
        quantity: 30,
        catId: electronics.category_id,
      },
      {
        name: "Mechanical Keyboard",
        desc: "RGB gaming.",
        price: 89.99,
        quantity: 100,
        catId: electronics.category_id,
      },
      {
        name: "USB-C Hub",
        desc: "7-in-1 adapter.",
        price: 45.0,
        quantity: 200,
        catId: accessories.category_id,
      },
      {
        name: "Charger",
        desc: "Portable power.",
        price: 1200,
        quantity: 23,
        catId: accessories.category_id,
      },
    ];

    for (const p of products) {
      await sql`
        INSERT INTO products (name, description, price, quantity, seller_id, category_id)
        VALUES (${p.name}, ${p.desc}, ${p.price}, ${p.quantity}, ${seller.seller_id}, ${p.catId})
      `;
    }

    console.log("Successfully inserted 5 products!");
  } catch (err) {
    console.error("Seeding Error:", err.message);
  }
}

// seed();
