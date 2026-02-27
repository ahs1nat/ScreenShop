import { sql } from "../config/db.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN product_category c ON p.category_id = c.category_id
      WHERE p.approved = true
      ORDER BY p.created_at DESC
    `;
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
