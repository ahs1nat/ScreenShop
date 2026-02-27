// import { sql } from "../config/db.js";

// // Not integrated with auto stock reduction

// export const placeOrder = async (req, res) => {
//   try {
//     const { total_price } = req.body;
//     const buyer_id = req.user.buyer_id;

//     if (!total_price) {
//       return res.status(400).json({
//         success: false,
//         message: "buyer_id and total_amount are required",
//       });
//     }

//     const newOrder = await sql`
//       INSERT INTO orders (buyer_id, total_price, status)
//       VALUES (${buyer_id}, ${total_price}, 'pending')
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


// // Integrated with auto stock reduction
// // export const placeOrder = async (req, res) => {
// //   try {
// //     const { total_price, items } = req.body; // items = [{ product_id, quantity }]
// //     const buyer_id = req.user.user_id;

// //     // Validate request
// //     if (!total_price || !items || !Array.isArray(items) || items.length === 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "total_price and items are required",
// //       });
// //     }

// //     // Begin a transaction to ensure atomicity
// //     await sql.transaction(async (tx) => {
// //       // Check stock for all items
// //       for (const item of items) {
// //         const product = await tx`
// //           SELECT quantity, name FROM products WHERE product_id = ${item.product_id}
// //         `;
// //         if (product.length === 0) {
// //           throw { status: 400, message: `Product ID ${item.product_id} not found` };
// //         }
// //         if (product[0].quantity < item.quantity) {
// //           throw { status: 400, message: `Insufficient stock for product "${product[0].name}"` };
// //         }
// //       }

// //       // Insert the order
// //       const newOrder = await tx`
// //         INSERT INTO orders (buyer_id, total_price, status)
// //         VALUES (${buyer_id}, ${total_price}, 'pending')
// //         RETURNING *
// //       `;

// //       const order_id = newOrder[0].order_id;

// //       // Insert order items and reduce stock
// //       for (const item of items) {
// //         // Insert into order_items table (assuming it exists)
// //         await tx`
// //           INSERT INTO order_items (order_id, product_id, quantity)
// //           VALUES (${order_id}, ${item.product_id}, ${item.quantity})
// //         `;

// //         // Reduce stock
// //         await tx`
// //           UPDATE products
// //           SET quantity = quantity - ${item.quantity}
// //           WHERE product_id = ${item.product_id}
// //         `;
// //       }

// //       res.status(201).json({
// //         success: true,
// //         message: "Order placed successfully",
// //         order: newOrder[0],
// //       });
// //     });
// //   } catch (error) {
// //     console.error("Error placing order:", error);
// //     // Handle custom errors from stock check
// //     if (error.status) {
// //       return res.status(error.status).json({
// //         success: false,
// //         message: error.message,
// //       });
// //     }

// //     res.status(500).json({
// //       success: false,
// //       message: "Server Error",
// //     });
// //   }
// // };

// export const viewOrders = async (req, res) => {
//   try {
//     const buyer_id = req.user.buyer_id;
//     const role = req.user.role;
//     const { status } = req.query;

//     let orders;

//     if (role === "admin") {
//       if (status) {
//         orders = await sql`
//           SELECT 
//             o.*,
//             u.name AS buyer_name,
//             u.email AS buyer_email
//           FROM orders o
//           JOIN users u ON o.buyer_id = u.user_id
//           WHERE o.status = ${status}
//           ORDER BY o.created_at DESC
//         `;
//       } else {
//         orders = await sql`
//           SELECT 
//             o.*,
//             u.name AS buyer_name,
//             u.email AS buyer_email
//           FROM orders o
//           JOIN users u ON o.buyer_id = u.user_id
//           ORDER BY o.created_at DESC
//         `;
//       }
//     } else {
//       if (status) {
//         orders = await sql`
//           SELECT * FROM orders
//           WHERE buyer_id = ${buyer_id}
//           AND status = ${status}
//           ORDER BY created_at DESC
//         `;
//       } else {
//         orders = await sql`
//           SELECT * FROM orders
//           WHERE buyer_id = ${buyer_id}
//           ORDER BY created_at DESC
//         `;
//       }
//     }

//     res.status(200).json({
//       success: true,
//       data: orders,
//     });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };


// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { id: order_id } = req.params; // renamed from id
//     const { status } = req.body;
//     const user = req.user;

//     if (!status) {
//       return res.status(400).json({
//         success: false,
//         message: "Status is required",
//       });
//     }

//     const allowedStatuses = [
//       "pending",
//       "confirmed",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];

//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status value",
//       });
//     }

//     const existingOrder = await sql`
//       SELECT * FROM orders WHERE order_id = ${order_id}
//     `;


//     if (existingOrder.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     const order = existingOrder[0];
//     const currentStatus = order.status;

//     // ADMIN can update to any allowed status
//     if (user.role === "admin") {
//       // no extra checks needed
//     }

//     // BUYER can only cancel if order is pending or confirmed
//     else if (user.role === "buyer") {
//       if (
//         status !== "cancelled" ||
//         !["pending", "confirmed"].includes(currentStatus)
//       ) {
//         return res.status(403).json({
//           success: false,
//           message: "You cannot update order to this status",
//         });
//       }

//       if (order.buyer_id !== user.buyer_id) {
//         return res.status(403).json({
//           success: false,
//           message: "Unauthorized",
//         });
//       }
//     }

//     // SELLER can only update orders that include their products
//     else if (user.role === "seller") {

//       // Fetch all products in the order that belong to this seller
//       const sellerProducts = await sql`
//         SELECT DISTINCT oi.product_id
//         FROM order_items oi
//         JOIN products p ON oi.product_id = p.product_id
//         WHERE oi.order_id = ${order_id} AND p.seller_id = ${user.seller_id}
//       `;

//       if (sellerProducts.length === 0) {
//         return res.status(403).json({
//           success: false,
//           message: "You cannot update this order (no products belong to you)",
//         });
//       }

//       // Allowed transitions for seller
//       const sellerAllowedTransitions = {
//         pending: "confirmed",
//         confirmed: "shipped",
//         shipped: "delivered",
//       };

//       if (sellerAllowedTransitions[currentStatus] !== status) {
//         return res.status(403).json({
//           success: false,
//           message: "Invalid status transition",
//         });
//       }
//     }

//     else {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized role",
//       });
//     }

//     const updated = await sql`
//       UPDATE orders
//       SET status = ${status}
//       WHERE order_id = ${order_id}
//       RETURNING *
//   `;


//     res.status(200).json({
//       success: true,
//       message: "Order status updated",
//       data: updated[0],
//     });

//   } catch (error) {
//     console.error("Error updating order status:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

// export const cancelOrder = async (req, res) => {
//   try {
//     const { id: order_id } = req.params;
//     const user = req.user;

//     const existingOrder = await sql`
//       SELECT * FROM orders WHERE order_id = ${order_id}
//     `;

//     if (existingOrder.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     const order = existingOrder[0];

//     if (order.buyer_id !== user.buyer_id) {
//       return res.status(403).json({
//         success: false,
//         message: "You can only cancel your own orders",
//       });
//     }

//     if (order.status === "shipped" || order.status === "delivered") {
//       return res.status(400).json({
//         success: false,
//         message: "Order cannot be cancelled at this stage",
//       });
//     }

//     const cancelledOrder = await sql`
//       UPDATE orders
//       SET status = 'cancelled'
//       WHERE order_id = ${order_id}
//       RETURNING *
//     `;

//     res.status(200).json({
//       success: true,
//       message: "Order cancelled successfully",
//       data: cancelledOrder[0],
//     });
//   } catch (error) {
//     console.error("Error cancelling order:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

// export const getMyOrders = async (req, res) => {
//   try {
//     const orders = await sql`
//       SELECT * FROM orders
//       WHERE buyer_id = ${req.user.buyer_id}
//       ORDER BY created_at DESC
//     `;

//     res.status(200).json({
//       success: true,
//       data: orders,
//     });
//   } catch (error) {
//     console.error("Error fetching user orders:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };


import { sql } from "../config/db.js";
import { pool } from "../config/db.js";

/**
 * POST /orders
 * Places an order from the buyer's current cart.
 *
 * Flow:
 *  1. Read all cart items for the buyer.
 *  2. For each cart item, check product stock.
 *     - Stock >= cart quantity  → add to order_items, reduce stock, remove from cart.
 *     - Stock <  cart quantity  → skip (leave in cart), collect in `skippedItems`.
 *  3. If NO items could be ordered, return 400 (nothing to order).
 *  4. Compute total_price from the accepted items and create the order.
 *  5. Return the order + any skipped items so the buyer knows what was left behind.
 *
 * Everything runs inside a single transaction for atomicity.
 */
export const placeOrder = async (req, res) => {
  const buyer_id = req.user.user_id;
  const client = await pool.connect(); // check out a dedicated connection
  try {
    let order;
    let skippedItems = [];

    await client.query("BEGIN");

    // 1. Fetch cart items with row lock
    const { rows: cartItems } = await client.query(
      `SELECT
          ci.cartitem_id,
          ci.product_id,
          ci.quantity   AS requested_qty,
          p.name        AS product_name,
          p.price       AS unit_price,
          p.quantity    AS stock_qty
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.product_id
        WHERE ci.buyer_id = $1
        FOR UPDATE OF p`,
      [buyer_id]
    );

    if (cartItems.length === 0) {
      throw { status: 400, message: "Your cart is empty" };
    }

    // 2. Separate items into orderable vs. skipped
    const orderableItems = [];

    for (const item of cartItems) {
      if (item.stock_qty >= item.requested_qty) {
        orderableItems.push(item);
      } else {
        skippedItems.push({
          product_id: item.product_id,
          product_name: item.product_name,
          requested_qty: item.requested_qty,
          available_qty: item.stock_qty,
          reason: `Only ${item.stock_qty} unit(s) in stock, but ${item.requested_qty} requested`,
        });
      }
    }

    if (orderableItems.length === 0) {
      throw {
        status: 400,
        message: "None of the items in your cart have sufficient stock to place an order",
        skippedItems,
      };
    }

    // 3. Compute total price from orderable items
    const total_price = orderableItems.reduce(
      (sum, item) => sum + parseFloat(item.unit_price) * item.requested_qty,
      0
    );

    // 4. Create the order
    const { rows: [newOrder] } = await client.query(
      `INSERT INTO orders (buyer_id, total_price, status)
       VALUES ($1, $2, 'pending')
       RETURNING *`,
      [buyer_id, total_price.toFixed(2)]
    );

    order = newOrder;
    const order_id = newOrder.order_id;

    // 5. For each orderable item: insert order_item, reduce stock, remove from cart
    for (const item of orderableItems) {
      // Insert into order_items (price snapshot at time of purchase)
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order_id, item.product_id, item.requested_qty, item.unit_price]
      );

      // Reduce product stock
      await client.query(
        `UPDATE products SET quantity = quantity - $1 WHERE product_id = $2`,
        [item.requested_qty, item.product_id]
      );

      await client.query(
        `DELETE FROM cart_items WHERE cartitem_id = $1`,
        [item.cartitem_id]
      );
    }
    await client.query("COMMIT");

    // Build response message
    const hasSkipped = skippedItems.length > 0;

    return res.status(201).json({
      success: true,
      message: hasSkipped
        ? "Order placed successfully. Some items were skipped due to insufficient stock and remain in your cart."
        : "Order placed successfully",
      data: order,
      ...(hasSkipped && { skippedItems }),
    });

  } catch (error) {
    await client.query("ROLLBACK");
    // Custom errors thrown inside the transaction
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
        ...(error.skippedItems && { skippedItems: error.skippedItems }),
      });
    }

    console.error("Error placing order:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  } finally {
    client.release(); // always release back to the pool, even on error
  }
};


/**
 * GET /orders
 * Admin → all orders (filterable by status).
 * Buyer → their own orders (filterable by status).
 */
export const viewOrders = async (req, res) => {
  try {
    // FIX: was incorrectly using req.user.user_id for the buyer branch
    const buyer_id = req.user.user_id;
    const role = req.user.role;
    const { status } = req.query;

    let orders;

    if (role === "admin") {
      orders = status
        ? await sql`
            SELECT o.*, u.name AS buyer_name, u.email AS buyer_email
            FROM orders o
            JOIN users u ON o.buyer_id = u.user_id
            WHERE o.status = ${status}
            ORDER BY o.created_at DESC
          `
        : await sql`
            SELECT o.*, u.name AS buyer_name, u.email AS buyer_email
            FROM orders o
            JOIN users u ON o.buyer_id = u.user_id
            ORDER BY o.created_at DESC
          `;
    } else {
      orders = status
        ? await sql`
            SELECT * FROM orders
            WHERE buyer_id = ${buyer_id} AND status = ${status}
            ORDER BY created_at DESC
          `
        : await sql`
            SELECT * FROM orders
            WHERE buyer_id = ${buyer_id}
            ORDER BY created_at DESC
          `;
    }

    res.status(200).json({ success: true, data: orders });

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


/**
 * PATCH /orders/:id/status
 * Role-based order status updates.
 * Admin  → any transition.
 * Buyer  → can only cancel (pending/confirmed).
 * Seller → linear progression: pending→confirmed→shipped→delivered.
 *
 * NOTE: When an order is cancelled via this route, stock is also restored.
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id: order_id } = req.params;
    const { status } = req.body;
    const user = req.user;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    // NOTE: Make sure your orders table CHECK constraint includes 'confirmed'.
    // UPDATE: CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled'))
    const allowedStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const existingOrder = await sql`SELECT * FROM orders WHERE order_id = ${order_id}`;

    if (existingOrder.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = existingOrder[0];
    const currentStatus = order.status;

    if (user.role === "admin") {
      // Admin can set any allowed status — no extra checks
    } else if (user.role === "buyer") {
      if (order.buyer_id !== user.user_id) //replaced buyer_id with user_id
      {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }
      if (status !== "cancelled" || !["pending", "confirmed"].includes(currentStatus)) {
        return res.status(403).json({
          success: false,
          message: "Buyers can only cancel orders that are pending or confirmed",
        });
      }
    } else if (user.role === "seller") //replaced selle rid with user id
    {
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

      const sellerAllowedTransitions = {
        pending: "confirmed",
        confirmed: "shipped",
        shipped: "delivered",
      };

      if (sellerAllowedTransitions[currentStatus] !== status) {
        return res.status(403).json({
          success: false,
          message: `Invalid transition: cannot move from '${currentStatus}' to '${status}'`,
        });
      }
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized role" });
    }

    // If cancelling, restore product stock inside a transaction
    if (status === "cancelled") {
      const client = await pool.connect();
      let updated;

      try {
        await client.query("BEGIN");

        const { rows: orderItems } = await client.query(
          `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
          [order_id]
        );

        for (const item of orderItems) {
          await client.query(
            `UPDATE products SET quantity = quantity + $1 WHERE product_id = $2`,
            [item.quantity, item.product_id]
          );
        }

        const { rows } = await client.query(
          `UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *`,
          [status, order_id]
        );
        updated = rows[0];

        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }

      return res.status(200).json({
        success: true,
        message: "Order cancelled and stock restored",
        data: updated,
      });
    }

    // Normal status update (no stock change)
    const [updated] = await sql`
      UPDATE orders SET status = ${status}
      WHERE order_id = ${order_id}
      RETURNING *
    `;

    res.status(200).json({ success: true, message: "Order status updated", data: updated });

  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


/**
 * PATCH /orders/:id/cancel
 * Buyer-specific cancel endpoint. Restores product stock on cancellation.
 */
export const cancelOrder = async (req, res) => {
  try {
    const { id: order_id } = req.params;
    const user = req.user;

    const existingOrder = await sql`SELECT * FROM orders WHERE order_id = ${order_id}`;

    if (existingOrder.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = existingOrder[0];

    if (order.buyer_id !== user.user_id) //replaced buyer id with user id
    {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own orders",
      });
    }

    if (["shipped", "delivered"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled once it has been shipped or delivered",
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Order is already cancelled" });
    }

    let cancelledOrder;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const { rows: orderItems } = await client.query(
        `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
        [order_id]
      );

      for (const item of orderItems) {
        await client.query(
          `UPDATE products SET quantity = quantity + $1 WHERE product_id = $2`,
          [item.quantity, item.product_id]
        );
      }

      const { rows } = await client.query(
        `UPDATE orders SET status = 'cancelled' WHERE order_id = $1 RETURNING *`,
        [order_id]
      );
      cancelledOrder = rows[0];

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err; // bubble up to the outer catch
    } finally {
      client.release();
    }

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully and stock has been restored",
      data: cancelledOrder,
    });

  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


/**
 * GET /orders/my-orders
 * Returns the authenticated buyer's orders.
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await sql`
      SELECT * FROM orders
      WHERE buyer_id = ${req.user.buyer_id}
      ORDER BY created_at DESC
    `;

    res.status(200).json({ success: true, data: orders });

  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getOrderItems = async (req, res) => {
  try {
    const { id: order_id } = req.params;
    const buyer_id = req.user.user_id;

    // Verify this order belongs to the buyer
    const order = await sql`
      SELECT * FROM orders WHERE order_id = ${order_id} AND buyer_id = ${buyer_id}
    `;
    if (order.length === 0) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const items = await sql`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ${order_id}
    `;

    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
