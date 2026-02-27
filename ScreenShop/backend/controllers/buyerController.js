import { sql } from "../config/db.js";

export const getBuyerProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const result = await sql`
      SELECT u.user_id, u.name, u.email, u.phone, u.created_at, b.address
      FROM users u
      JOIN buyers b ON u.user_id = b.buyer_id
      WHERE u.user_id = ${user_id}
    `;

    if (result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    res.json({ success: true, profile: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBuyerProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { name, email, phone, address } = req.body;

    await sql`
      UPDATE users
      SET
        name = COALESCE(${name}, name),
        email = COALESCE(${email}, email),
        phone = COALESCE(${phone}, phone)
      WHERE user_id = ${user_id}
    `;

    await sql`
      UPDATE buyers
      SET address = COALESCE(${address}, address)
      WHERE buyer_id = ${user_id}
    `;

    const updated = await sql`
      SELECT u.user_id, u.name, u.email, u.phone, u.created_at, b.address
      FROM users u
      JOIN buyers b ON u.user_id = b.buyer_id
      WHERE u.user_id = ${user_id}
    `;

    res.json({ success: true, profile: updated[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
