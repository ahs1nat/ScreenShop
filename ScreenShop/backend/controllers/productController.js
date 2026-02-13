import { sql } from "../config/db.js";

export const getAllProducts = async (req, res) => {
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

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, category_id, image_url } =
      req.body;

    if (!name || !price || !quantity || !category_id) {
      return res.status(400).json({
        success: false,
        message: "Name, price, quantity, and category are required",
      });
    }

    const newProduct = await sql`
    INSERT INTO products (seller_id,category_id,name,description,image_url,price,quantity,approved)
    VALUES (${req.user.user_id},${category_id},${name},${description || " "},${image_url || " "}, ${price}, ${quantity},false)
    RETURNING *
    `;
    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: newProduct[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const existing = await sql`
      SELECT * FROM product WHERE product_id = ${productId} AND seller_id = ${req.user.user_id}
    `;
    if (existing.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own products",
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

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params;
    const { name, description, price, quantity, category_id, image_url } =
      req.body;
    const existing = await sql`
      SELECT * FROM product WHERE product_id = ${productId} AND seller_id = ${req.user.user_id}
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
    approved = false  -- reset approval if edited
    WHERE product_id = ${productId}
    RETURNING *;
    `;

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updated[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
