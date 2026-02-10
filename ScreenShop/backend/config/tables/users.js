import { sql } from "../db.js";

export async function createUsersTable() {
  try {
    //await sql`DROP TABLE IF EXISTS users CASCADE;`;
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('buyer', 'seller','admin')),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("DB users table created successfully");
  } catch (error) {
    console.log("Error creating users in initDB: ", error);
    process.exit(1);
  }
}

