import { sql } from "../config/db.js";

// ─── DASHBOARD ───────────────────────────────────────────────
export const getSellerStats = async (req, res) => {
  try {
    const sellerId = req.user.user_id;

    const [totalProducts] = await sql`
      SELECT COUNT(*) FROM products WHERE seller_id = ${sellerId}
    `;
    const [pendingProducts] = await sql`
      SELECT COUNT(*) FROM products WHERE seller_id = ${sellerId} AND approved = false
    `;
    const [totalOrders] = await sql`
      SELECT COUNT(DISTINCT o.order_id)
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE p.seller_id = ${sellerId}
    `;
    const [pendingOrders] = await sql`
      SELECT COUNT(DISTINCT o.order_id)
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE p.seller_id = ${sellerId} AND o.status = 'pending'
    `;
    const [totalRevenue] = await sql`
      SELECT COALESCE(SUM(oi.price * oi.quantity), 0) AS total
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE p.seller_id = ${sellerId} AND o.status = 'delivered'
    `;
    const topProducts = await sql`
      SELECT 
        p.product_id,
        p.name,
        p.price,
        c.name AS category_name,
        COALESCE(SUM(oi.quantity), 0) AS total_sold
      FROM products p
      LEFT JOIN order_items oi ON p.product_id = oi.product_id
      LEFT JOIN product_category c ON p.category_id = c.category_id
      WHERE p.seller_id = ${sellerId}
      GROUP BY p.product_id, p.name, p.price, c.name
      ORDER BY total_sold DESC, p.created_at ASC
      LIMIT 5
    `;

    res.json({
      success: true,
      totalProducts: parseInt(totalProducts.count),
      pendingProducts: parseInt(pendingProducts.count),
      totalOrders: parseInt(totalOrders.count),
      pendingOrders: parseInt(pendingOrders.count),
      totalRevenue: parseFloat(totalRevenue.total),
      topProducts,
    });
  } catch (error) {
    console.error("Seller stats error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PRODUCTS ────────────────────────────────────────────────
export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.user_id;
    const products = await sql`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN product_category c ON p.category_id = c.category_id
      WHERE p.seller_id = ${sellerId}
      ORDER BY p.created_at DESC
    `;
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createSellerProduct = async (req, res) => {
  try {
    const sellerId = req.user.user_id;
    const { name, description, price, quantity, category_id, image_url } =
      req.body;

    if (!name || !price || !quantity || !category_id) {
      return res.status(400).json({
        success: false,
        message: "Name, price, quantity, and category are required",
      });
    }

    const newProduct = await sql`
      INSERT INTO products (seller_id, category_id, name, description, image_url, price, quantity, approved)
      VALUES (${sellerId}, ${category_id}, ${name}, ${description || null}, ${image_url || null}, ${price}, ${quantity}, false)
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      message: "Product submitted for approval",
      product: newProduct[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSellerProduct = async (req, res) => {
  try {
    const sellerId = req.user.user_id;
    const { productId } = req.params; // ← fixed from original
    const { name, description, price, quantity, category_id, image_url } =
      req.body;

    const existing = await sql`
      SELECT * FROM products WHERE product_id = ${productId} AND seller_id = ${sellerId}
    `;
    if (existing.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own products",
      });
    }

    const updated = await sql`
      UPDATE products
      SET
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        price = COALESCE(${price}, price),
        quantity = COALESCE(${quantity}, quantity),
        category_id = COALESCE(${category_id}, category_id),
        image_url = COALESCE(${image_url}, image_url),
        approved = false
      WHERE product_id = ${productId} AND seller_id = ${sellerId}
      RETURNING *
    `;

    res.json({
      success: true,
      message: "Product updated — pending re-approval",
      product: updated[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSellerProduct = async (req, res) => {
  try {
    const sellerId = req.user.user_id;
    const { productId } = req.params;

    const existing = await sql`
      SELECT * FROM products WHERE product_id = ${productId} AND seller_id = ${sellerId}
    `;
    if (existing.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own products",
      });
    }

    // await sql`DELETE FROM answers WHERE question_id IN (SELECT question_id FROM questions WHERE product_id = ${productId})`;
    // await sql`DELETE FROM questions WHERE product_id = ${productId}`;
    // await sql`DELETE FROM reviews WHERE product_id = ${productId}`;
    // await sql`DELETE FROM cart_items WHERE product_id = ${productId}`;
    // await sql`DELETE FROM order_items WHERE product_id = ${productId}`;
    // await sql`DELETE FROM product_discounts WHERE product_id = ${productId}`;
    await sql`DELETE FROM products WHERE product_id = ${productId}`;

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProductStock = async (req, res) => {
  try {
    const sellerId = req.user.user_id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity == null || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a non-negative number",
      });
    }

    const existing = await sql`
      SELECT * FROM products WHERE product_id = ${productId} AND seller_id = ${sellerId}
    `;
    if (existing.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You can only update stock for your own products",
      });
    }

    const updated = await sql`
      UPDATE products
      SET quantity = ${quantity}
      WHERE product_id = ${productId}
      RETURNING *
    `;

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      product: updated[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
