import { sql } from "../config/db.js";

export const placeOrder = async (req, res) => {
  try {
    const { total_amount } = req.body;
    const user_id = req.user.user_id;

    if (!total_amount) {
      return res.status(400).json({
        success: false,
        message: "user_id and total_amount are required",
      });
    }

    const newOrder = await sql`
      INSERT INTO Orders (user_id, total_amount)
      VALUES (${user_id}, ${total_amount})
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newOrder[0],
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const viewOrders = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const role = req.user.role;

    let orders;

    if (role === "admin") {
      orders = await sql`
        SELECT * FROM Orders
        ORDER BY created_at DESC
      `;
    } else {
      orders = await sql`
        SELECT * FROM Orders
        WHERE user_id = ${user_id}
        ORDER BY created_at DESC
      `;
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
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const order = await sql`
      UPDATE Orders
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;

    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order[0],
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
    const { id } = req.params;
    const user_id = req.user.user_id;

    // First check order ownership
    const existingOrder = await sql`
      SELECT * FROM Orders
      WHERE id = ${id}
    `;

    if (existingOrder.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = existingOrder[0];

    // Check if order belongs to user
    if (order.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own orders",
      });
    }

    // Prevent cancellation if already shipped/delivered
    if (order.status === "shipped" || order.status === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    const cancelledOrder = await sql`
      UPDATE Orders
      SET status = 'cancelled'
      WHERE id = ${id}
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
