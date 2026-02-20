import { sql } from "../config/db.js";

export const addToCart = async (req, res) => {
    try {
        const buyer_id = req.user.buyer_id;
        const { product_id, quantity } = req.body;

        if (!buyer_id) {
            console.error("User object is missing ID:", req.user);
            return res.status(401).json({
                success: false,
                message: "User ID missing from token"
            });
        }

        if (!product_id || !quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Valid product_id and quantity required"
            });
        }

        const result = await sql`
      INSERT INTO cart_items (buyer_id, product_id, quantity)
      VALUES (${buyer_id}, ${product_id}, ${quantity})
      ON CONFLICT (buyer_id, product_id)
      DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
      RETURNING *
    `;

        res.status(201).json({
            success: true,
            data: result[0]
        });

    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const viewCart = async (req, res) => {
    try {
        const buyer_id = req.user.buyer_id;

        const items = await sql`
      SELECT 
        ci.cartitem_id,
        ci.quantity,
        p.product_id,
        p.name,
        p.price
      FROM cart_items ci
      JOIN products p
      ON ci.product_id = p.product_id
      WHERE ci.buyer_id = ${buyer_id}
    `;

        res.status(200).json({
            success: true,
            data: items
        });

    } catch (error) {
        console.error("View cart error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const updateCart = async (req, res) => {
    try {
        const buyer_id = req.user.buyer_id;
        const { itemId } = req.params;
        const { quantity: newQuantity } = req.body; // Renamed for clarity

        if (!newQuantity || newQuantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Valid quantity required (minimum 1)"
            });
        }

        const existingItem = await sql`
            SELECT quantity FROM cart_items 
            WHERE cartitem_id = ${itemId} AND buyer_id = ${buyer_id}
        `;

        if (existingItem.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        const currentQuantity = existingItem[0].quantity;

        if (newQuantity >= currentQuantity) {
            return res.status(400).json({
                success: false,
                message: `You can only decrease the quantity. Current quantity is ${currentQuantity}.`
            });
        }

        const updated = await sql`
            UPDATE cart_items
            SET quantity = ${newQuantity}
            WHERE cartitem_id = ${itemId}
            AND buyer_id = ${buyer_id}
            RETURNING *
        `;

        res.status(200).json({
            success: true,
            message: "Quantity decreased successfully",
            data: updated[0]
        });

    } catch (error) {
        console.error("Update cart error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const buyer_id = req.user.buyer_id;
        const { itemId } = req.params;

        const deleted = await sql`
      DELETE FROM cart_items
      WHERE cartitem_id = ${itemId}
      AND buyer_id = ${buyer_id}
      RETURNING *
    `;

        if (deleted.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Item removed successfully"
        });

    } catch (error) {
        console.error("Remove cart error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
