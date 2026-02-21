import { sql } from "../config/db.js";

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
      JOIN users u ON s.seller_id = u.user_id
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
      SELECT user_id FROM users WHERE user_id = ${id}
    `;

    if (existingSeller.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    await sql`
      DELETE FROM users WHERE user_id = ${id}
    `;

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
      return res.status(404).json({ success: false, message: "Store not found" });
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
        SELECT p.*, c.name as category_name 
        FROM products p
        LEFT JOIN product_category c ON p.category_id = c.category_id
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

    await sql`DELETE FROM product WHERE product_id = ${productId}`;

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
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
