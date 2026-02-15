import { sql } from "../config/db.js";

// Not integrated with auto stock reduction
// export const placeOrder = async (req, res) => {
//   try {
//     const { total_amount } = req.body;
//     const user_id = req.user.user_id;

//     if (!total_amount) {
//       return res.status(400).json({
//         success: false,
//         message: "user_id and total_amount are required",
//       });
//     }

//     const newOrder = await sql`
//       INSERT INTO Orders (user_id, total_amount)
//       VALUES (${user_id}, ${total_amount})
//       RETURNING *
//     `;

//     res.status(201).json({
//       success: true,
//       data: newOrder[0],
//     });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };


// Integrated with auto stock reduction
export const placeOrder = async (req, res) => {
  try {
    const { total_price, items } = req.body; // items = [{ product_id, quantity }]
    const buyer_id = req.user.user_id;

    // Validate request
    if (!total_price || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "total_price and items are required",
      });
    }

    // Begin a transaction to ensure atomicity
    await sql.begin(async (tx) => {
      // Check stock for all items
      for (const item of items) {
        const product = await tx`
          SELECT quantity, name FROM products WHERE product_id = ${item.product_id}
        `;
        if (product.length === 0) {
          throw { status: 400, message: `Product ID ${item.product_id} not found` };
        }
        if (product[0].quantity < item.quantity) {
          throw { status: 400, message: `Insufficient stock for product "${product[0].name}"` };
        }
      }

      // Insert the order
      const newOrder = await tx`
        INSERT INTO orders (buyer_id, total_price, status)
        VALUES (${buyer_id}, ${total_price}, 'pending')
        RETURNING *
      `;

      const order_id = newOrder[0].order_id;

      // Insert order items and reduce stock
      for (const item of items) {
        // Insert into order_items table (assuming it exists)
        await tx`
          INSERT INTO order_items (order_id, product_id, quantity)
          VALUES (${order_id}, ${item.product_id}, ${item.quantity})
        `;

        // Reduce stock
        await tx`
          UPDATE products
          SET quantity = quantity - ${item.quantity}
          WHERE product_id = ${item.product_id}
        `;
      }

      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order: newOrder[0],
      });
    });
  } catch (error) {
    console.error("Error placing order:", error);
    // Handle custom errors from stock check
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const viewOrders = async (req, res) => {
  try {
    const buyer_id = req.user.user_id;   // assuming token stores user_id
    const role = req.user.role;
    const { status } = req.query;

    let orders;

    if (role === "admin") {
      if (status) {
        orders = await sql`
          SELECT * FROM orders
          WHERE status = ${status}
          ORDER BY created_at DESC
        `;
      } else {
        orders = await sql`
          SELECT * FROM orders
          ORDER BY created_at DESC
        `;
      }
    } else {
      if (status) {
        orders = await sql`
          SELECT * FROM orders
          WHERE buyer_id = ${buyer_id}
          AND status = ${status}
          ORDER BY created_at DESC
        `;
      } else {
        orders = await sql`
          SELECT * FROM orders
          WHERE buyer_id = ${buyer_id}
          ORDER BY created_at DESC
        `;
      }
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params; // renamed from id
    const { status } = req.body;
    const user = req.user;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const allowedStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const existingOrder = await sql`
      SELECT * FROM orders WHERE order_id = ${order_id}
    `;


    if (existingOrder.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = existingOrder[0];
    const currentStatus = order.status;

    // ADMIN can update to any allowed status
    if (user.role === "admin") {
      // no extra checks needed
    }

    // BUYER can only cancel if order is pending or confirmed
    else if (user.role === "buyer") {
      if (
        status !== "cancelled" ||
        !["pending", "confirmed"].includes(currentStatus)
      ) {
        return res.status(403).json({
          success: false,
          message: "You cannot update order to this status",
        });
      }

      if (order.buyer_id !== user.user_id) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }
    }

    // SELLER can only update orders that include their products
    else if (user.role === "seller") {

      // Fetch all products in the order that belong to this seller
      const sellerProducts = await sql`
        SELECT DISTINCT oi.product_id
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ${order_id} AND p.seller_id = ${user.user_id}
      `;

      if (sellerProducts.length === 0) {
        return res.status(403).json({
          success: false,
          message: "You cannot update this order (no products belong to you)",
        });
      }

      // Allowed transitions for seller
      const sellerAllowedTransitions = {
        pending: "confirmed",
        confirmed: "shipped",
        shipped: "delivered",
      };

      if (sellerAllowedTransitions[currentStatus] !== status) {
        return res.status(403).json({
          success: false,
          message: "Invalid status transition",
        });
      }
    }
    
    else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized role",
      });
    }

    const updated = await sql`
      UPDATE orders
      SET status = ${status}
      WHERE order_id = ${order_id}
      RETURNING *
  `;


    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: updated[0],
    });

  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const user_id = req.user.user_id;

    const existingOrder = await sql`
      SELECT * FROM orders WHERE order_id = ${order_id}
    `;

    if (existingOrder.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = existingOrder[0];

    if (order.buyer_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own orders",
      });
    }

    if (order.status === "shipped" || order.status === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    const cancelledOrder = await sql`
      UPDATE orders
      SET status = 'cancelled'
      WHERE order_id = ${order_id}
      RETURNING *
    `;

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: cancelledOrder[0],
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const orders = await sql`
      SELECT * FROM orders
      WHERE buyer_id = ${req.user.user_id}
      ORDER BY created_at DESC
    `;

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
