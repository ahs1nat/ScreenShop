import { sql } from "../config/db.js";

export const getAdminStats = async (req, res) => {
  try {
    const [totalStores] = await sql`SELECT COUNT(*) FROM sellers`;
    console.log("totalStores raw:", totalStores);
    const [pendingStores] =
      await sql`SELECT COUNT(*) FROM sellers WHERE approved = false`;
    const [totalProducts] = await sql`SELECT COUNT(*) FROM products`;
    const [pendingProducts] =
      await sql`SELECT COUNT(*) FROM products WHERE approved = false`;
    const [totalCustomers] = await sql`SELECT COUNT(*) FROM buyers`;
    const [totalSells] =
      await sql`SELECT COALESCE(SUM(total_price), 0) AS total FROM orders WHERE status = 'delivered'`;

    res.json({
      success: true,
      totalStores: parseInt(totalStores.count),
      pendingStores: parseInt(pendingStores.count),
      totalProducts: parseInt(totalProducts.count),
      pendingProducts: parseInt(pendingProducts.count),
      totalCustomers: parseInt(totalCustomers.count),
      totalSells: parseFloat(totalSells.total),
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTopSellers = async (req, res) => {
  try {
    const topSellers = await sql`
      SELECT 
        s.seller_id,
        s.store_name,
        COUNT(DISTINCT o.order_id) as total_orders,
        COALESCE(SUM(oi.price * oi.quantity), 0) as total_revenue,
        u.created_at
      FROM sellers s
      LEFT JOIN users u ON s.seller_id = u.user_id
      LEFT JOIN products p ON s.seller_id = p.seller_id
      LEFT JOIN order_items oi ON p.product_id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.order_id AND o.status = 'delivered'
      WHERE o.status = 'delivered' OR o.status IS NULL
      GROUP BY s.seller_id, s.store_name, u.created_at
      ORDER BY total_revenue DESC, total_orders DESC, u.created_at ASC
      LIMIT 5
    `;
    //coalesce means "use the 1st non-null value"

    res.json({ success: true, topSellers });
  } catch (error) {
    console.error("Error fetching top sellers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const topProducts = await sql`
    SELECT 
      p.product_id,
      p.name,
      p.price,
      p.image_url,
      p.created_at,
      s.store_name,
      COUNT(oi.order_item_id) as total_orders,
      COALESCE(SUM(oi.quantity), 0) as total_sold
    FROM products p
    LEFT JOIN order_items oi ON p.product_id = oi.product_id
    LEFT JOIN sellers s ON p.seller_id = s.seller_id
    GROUP BY p.product_id, p.name, p.price, p.image_url, p.created_at, s.store_name
    ORDER BY total_sold DESC, total_orders DESC, p.created_at ASC
    LIMIT 5
    `;

    res.json({ success: true, topProducts });
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllStores = async (req, res) => {
  try {
    const stores = await sql`
      SELECT 
        s.seller_id,
        s.store_name,
        s.approved,
        u.name,
        u.email
      FROM sellers s
      LEFT JOIN users u ON s.seller_id = u.user_id
      ORDER BY s.seller_id ASC
    `;

    res.json({
      success: true,
      stores,
    });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllPendingStores = async (req, res) => {
  try {
    const stores = await sql`
      SELECT 
        s.seller_id,
        s.store_name,
        s.approved,
        u.name,
        u.email
      FROM sellers s
      JOIN users u ON s.seller_id = u.user_id
      WHERE s.approved = false
      ORDER BY s.seller_id ASC
    `;

    res.json({
      success: true,
      stores,
    });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const existingSeller = await sql`
      SELECT seller_id FROM sellers WHERE seller_id = ${id}
    `;

    if (existingSeller.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    await sql`DELETE FROM sellers WHERE seller_id = ${id}`;
    await sql`DELETE FROM users WHERE user_id = ${id}`;

    res.status(200).json({
      success: true,
      message: "Seller deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Seller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const approveStore = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await sql`
      UPDATE sellers
      SET approved = TRUE
      WHERE seller_id = ${id}
      RETURNING *
    `;

    if (updated.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Store not found" });
    }

    res.json({
      success: true,
      message: "Store approved successfully",
      store: updated[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await sql`
        SELECT p.*, c.name as category_name, s.store_name
        FROM products p
        LEFT JOIN product_category c ON p.category_id = c.category_id
        LEFT JOIN sellers s ON p.seller_id = s.seller_id
        ORDER BY p.created_at DESC
      `;
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPendingProducts = async (req, res) => {
  try {
    const products = await sql`
        SELECT p.*, c.name as category_name 
        FROM products p
        LEFT JOIN product_category c ON p.category_id = c.category_id
        WHERE p.approved=false
        ORDER BY p.created_at DESC
      `;
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const existing = await sql`
      SELECT * FROM products WHERE product_id = ${productId}
    `;
    if (existing.length === 0) {
      return res.status(403).json({
        success: false,
        message: "No product found",
      });
    }

    if (existing[0].approved) {
      return res.status(400).json({
        success: false,
        message: "Product already approved",
      });
    }

    const updated = await sql`
      UPDATE products
      SET approved = TRUE
      WHERE product_id = ${productId}
      RETURNING *
    `;

    res.status(200).json({
      success: true,
      message: "Product approved successfully",
      product: updated[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Attempting to delete product id:", id);
    const existing = await sql`
      SELECT * FROM products WHERE product_id = ${id}
    `;

    console.log("Existing product:", existing); 
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No product found",
      });
    }

    console.log("Deleting order_items...");
    await sql`DELETE FROM order_items WHERE product_id = ${id}`;
    await sql`DELETE FROM cart_items WHERE product_id = ${id}`;

    console.log("Deleting product...");
    await sql`DELETE FROM products WHERE product_id = ${id}`;
    

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Full delete error:", error.message); // updated
    console.error("Error detail:", error.detail); // add this
    console.error("Error constraint:", error.constraint); // add this
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await sql`
      SELECT * FROM product_category
      ORDER BY category_id ASC
    `;

    res.json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    const newCategory = await sql`
      INSERT INTO product_category (name)
      VALUES (${name})
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      category: newCategory[0],
    });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    const updatedCategory = await sql`
      UPDATE product_category
      SET name = ${name}
      WHERE category_id = ${id}
      RETURNING *
    `;

    if (updatedCategory.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory[0],
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await sql`
      DELETE FROM product_category
      WHERE category_id = ${id}
      RETURNING *
    `;

    if (deletedCategory.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getDiscounts = async (req, res) => {
  res.json({ success: true, discounts: [] });
};

export const addDiscount = async (req, res) => {
  res.json({ success: true, message: "addDiscount placeholder executed" });
};

export const editDiscount = async (req, res) => {
  res.json({ success: true, message: "editDiscount placeholder executed" });
};

export const deleteDiscount = async (req, res) => {
  res.json({ success: true, message: "deleteDiscount placeholder executed" });
};
