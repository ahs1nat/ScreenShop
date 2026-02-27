import { sql } from "../config/db.js";
import { getCategories } from "./adminController.js";

export const getAllProducts = async (req, res) => {
  try {
    const { sort, category, limit = 20, offset = 0 } = req.query;

    const products = await sql`
      SELECT p.*, c.name as category_name, s.store_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.review_id) as review_count,
        COALESCE(SUM(oi.quantity), 0) as total_sold
      FROM products p
      LEFT JOIN product_category c ON p.category_id = c.category_id
      LEFT JOIN sellers s ON p.seller_id = s.seller_id
      LEFT JOIN reviews r ON p.product_id = r.product_id
      LEFT JOIN order_items oi ON p.product_id = oi.product_id
      WHERE p.approved = true
      ${category ? sql`AND LOWER(c.name) = LOWER(${category})` : sql``}
      GROUP BY p.product_id, c.name, s.store_name
      ORDER BY ${
        sort === "top"
          ? sql`total_sold DESC, p.created_at DESC`
          : sort === "rating"
            ? sql`avg_rating DESC, p.created_at DESC`
            : sort === "price_asc"
              ? sql`p.price ASC`
              : sort === "price_desc"
                ? sql`p.price DESC`
                : sql`p.created_at DESC`
      }
      LIMIT ${parseInt(limit)}
      OFFSET ${parseInt(offset)}
    `;

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNewArrivals = async (req, res) => {
  try {
    const products = await sql`
      SELECT p.*, c.name as category_name, s.store_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.review_id) as review_count
      FROM products p
      LEFT JOIN product_category c ON p.category_id = c.category_id
      LEFT JOIN sellers s ON p.seller_id = s.seller_id
      LEFT JOIN reviews r ON p.product_id = r.product_id
      WHERE p.approved = true
      GROUP BY p.product_id, c.name, s.store_name
      ORDER BY p.created_at DESC
      LIMIT 10
    `;
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT p.*, c.name as category_name, s.store_name,
        COALESCE(SUM(oi.quantity), 0) as total_sold,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.review_id) as review_count
      FROM products p
      LEFT JOIN product_category c ON p.category_id = c.category_id
      LEFT JOIN sellers s ON p.seller_id = s.seller_id
      LEFT JOIN order_items oi ON p.product_id = oi.product_id
      LEFT JOIN reviews r ON p.product_id = r.product_id
      WHERE p.approved = true
      GROUP BY p.product_id, c.name, s.store_name
      ORDER BY total_sold DESC, p.created_at DESC
      LIMIT 10
    `;
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTopSellers = async (req, res) => {
  try {
    const sellers = await sql`
      SELECT 
        s.seller_id,
        s.store_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COALESCE(SUM(oi.quantity), 0) as total_sales
      FROM sellers s
      LEFT JOIN products p ON s.seller_id = p.seller_id
      LEFT JOIN reviews r ON p.product_id = r.product_id
      LEFT JOIN order_items oi ON p.product_id = oi.product_id
      WHERE s.approved = true
      GROUP BY s.seller_id, s.store_name
      ORDER BY total_sales DESC, avg_rating DESC
      LIMIT 4
    `;
    res.json({ success: true, data: sellers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await sql`
      SELECT p.*, c.name as category_name, s.store_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.review_id) as review_count
      FROM products p
      LEFT JOIN product_category c ON p.category_id = c.category_id
      LEFT JOIN sellers s ON p.seller_id = s.seller_id
      LEFT JOIN reviews r ON p.product_id = r.product_id
      WHERE p.product_id = ${productId} AND p.approved = true
      GROUP BY p.product_id, c.name, s.store_name
    `;

    if (product.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const reviews = await sql`
      SELECT r.*, u.name as buyer_name
      FROM reviews r
      JOIN users u ON r.buyer_id = u.user_id
      WHERE r.product_id = ${productId}
      ORDER BY r.created_at DESC
    `;

    const questions = await sql`
      SELECT q.*, u.name as buyer_name,
        a.answer_text, a.created_at as answer_date
      FROM questions q
      JOIN users u ON q.buyer_id = u.user_id
      LEFT JOIN answers a ON q.question_id = a.question_id
      WHERE q.product_id = ${productId}
      ORDER BY q.created_at DESC
    `;

    res.json({
      success: true,
      data: { ...product[0], reviews, questions },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};