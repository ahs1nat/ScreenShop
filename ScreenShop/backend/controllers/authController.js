import { sql } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
  const { name, email, password, phone, role, address, store_name } = req.body;
  console.log("REQ.BODY:", req.body);

  if (!name || !email || !password || !role || !phone) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (role === "buyer" && !address) {
    return res.status(400).json({
      success: false,
      message: "Address is required for buyers",
    });
  }

  if (role === "seller" && !store_name) {
    return res.status(400).json({
      success: false,
      message: "Store name is required for sellers",
    });
  }
  try {
    const existingUser = await sql`SELECT * FROM users WHERE email= ${email}`;
    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = await sql`
      INSERT INTO users (name, email, password_hash, phone, role)
      VALUES (${name}, ${email}, ${hashedPass}, ${phone}, ${role})
      RETURNING user_id, name, email, phone, role, created_at
    `;
    const createdUser = newUser[0];

    try {
      if (role === "buyer") {
        await sql`
          INSERT INTO buyers (buyer_id, address)
          VALUES (${createdUser.user_id}, ${address})
        `;
      } else if (role === "seller") {
        await sql`
          INSERT INTO sellers (seller_id, store_name, approved)
          VALUES (${createdUser.user_id}, ${store_name}, false)
        `;
      }
    } catch (err) {
      await sql`DELETE FROM users WHERE user_id=${createdUser.user_id}`;
      throw err;
    }
    
    const token = generateToken(createdUser.user_id, createdUser.role);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: createdUser,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const users = await sql`
        SELECT * FROM users WHERE email=${email}
        `;
    if (users.length == 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.role === "seller") {
      const sellers =
        await sql`SELECT * FROM sellers WHERE seller_id = ${user.user_id}`;
      if (sellers.length === 0 || !sellers[0].approved) {
        return res.status(403).json({
          success: false,
          message: "Seller not approved yet",
        });
      }
    }

    const token = generateToken(user.user_id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { register, login };
