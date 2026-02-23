// backend/seeds/seed.js
import { sql } from "../config/db.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs"; //without this server isn't running

dotenv.config();

export async function seed() {
  try {
    console.log("Starting database seed...");

    // ----------------------------
    // 1️⃣ Create admin user (idempotent)
    // ----------------------------
    const adminPassword = "admin123"; // change to whatever you want
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const [adminUser] = await sql`
      INSERT INTO users (name, email, password_hash, phone, role)
      VALUES (
        'Shop_Admin',
        'admin@screenshop.com',
        ${hashedPassword},
        '0123456678',
        'admin'
      )
      ON CONFLICT (email) DO UPDATE
      SET
        name = EXCLUDED.name,
        password_hash = EXCLUDED.password_hash,
        phone = EXCLUDED.phone,
        role = EXCLUDED.role
      RETURNING user_id
    `;

    console.log(`Admin user ready with ID: ${adminUser.user_id}`);

    // ----------------------------
    // 2️⃣ Insert product categories (idempotent)
    // ----------------------------
    const [electronics] = await sql`
      INSERT INTO product_category (name)
      VALUES ('Electronics')
      ON CONFLICT (name) DO NOTHING
      RETURNING category_id
    `;

    const [accessories] = await sql`
      INSERT INTO product_category (name)
      VALUES ('Accessories')
      ON CONFLICT (name) DO NOTHING
      RETURNING category_id
    `;

    console.log("Product categories ready.");

    // ----------------------------
    // 3️⃣ Create a sample seller (optional)
    // ----------------------------
    // This is a real seller, not admin
    const sellerEmail = "seller1@screenshop.com";
    const sellerPassword = await bcrypt.hash("seller123", 10);

    const [sellerUser] = await sql`
      INSERT INTO users (name, email, password_hash, phone, role)
      VALUES ('Sample Seller', ${sellerEmail}, ${sellerPassword}, '0112233445', 'seller')
      ON CONFLICT (email) DO NOTHING
      RETURNING user_id
    `;

    if (sellerUser) {
      const [sellerRecord] = await sql`
        INSERT INTO sellers (seller_id, store_name, approved)
        VALUES (${sellerUser.user_id}, 'ScreenShop Official', true)
        ON CONFLICT (seller_id) DO NOTHING
        RETURNING seller_id
      `;
      console.log(`Sample seller created with ID: ${sellerRecord.seller_id}`);

      // ----------------------------
      // 4️⃣ Insert products for this seller
      // ----------------------------
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
          VALUES (${p.name}, ${p.desc}, ${p.price}, ${p.quantity}, ${sellerRecord.seller_id}, ${p.catId})
          ON CONFLICT (name, seller_id) DO NOTHING
        `;
      }

      console.log("Sample products inserted for seller.");
    } else {
      console.log(
        "Seller already exists, skipping seller and products insert.",
      );
    }

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding Error:", err.message);
    process.exit(1);
  }
}

// Actually run the seed
// seed();
