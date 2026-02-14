import { sql } from "../config/db.js";

export const addToCart = async (req, res) => {
    try {
        const buyer_id = req.user.buyer_id;
        const { product_id, quantity } = req.body;

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
        p.product_name,
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
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Valid quantity required"
            });
        }

        const updated = await sql`
      UPDATE cart_items
      SET quantity = ${quantity}
      WHERE cartitem_id = ${itemId}
      AND buyer_id = ${buyer_id}
      RETURNING *
    `;

        if (updated.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        res.status(200).json({
            success: true,
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
