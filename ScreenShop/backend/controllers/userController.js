import { sql } from "../config/db.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await sql`
      SELECT user_id, name, email, phone, role, created_at
      FROM users
      ORDER BY user_id ASC
    `;

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await sql`
      SELECT user_id, name, email, phone, role, created_at
      FROM users
      WHERE user_id = ${id}
    `;

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user[0],
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await sql`
      SELECT user_id FROM users WHERE user_id = ${id}
    `;

    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await sql`
      DELETE FROM users WHERE user_id = ${id}
    `;

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role exists
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    // Must match DB CHECK constraint
    const allowedRoles = ["buyer", "seller", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Allowed roles: buyer, seller, admin",
      });
    }

    const updatedUser = await sql`
      UPDATE users
      SET role = ${role}
      WHERE user_id = ${id}
      RETURNING user_id, name, email, phone, role, created_at
    `;

    if (updatedUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: updatedUser[0],
    });

  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
