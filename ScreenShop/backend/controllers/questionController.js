import { sql } from "../config/db.js";

// POST /api/products/:id/questions
// Authenticated buyers ask a question on a product
export const askQuestion = async (req, res) => {
  try {
    const { id: product_id } = req.params;
    const { question_text } = req.body;
    const buyer_id = req.user.user_id;

    if (!question_text?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Question text is required." });
    }

    // Confirm the product exists and is approved
    const [product] = await sql`
      SELECT product_id FROM products
      WHERE product_id = ${product_id} AND approved = true
    `;
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    const [question] = await sql`
      INSERT INTO questions (product_id, buyer_id, question_text)
      VALUES (${product_id}, ${buyer_id}, ${question_text.trim()})
      RETURNING *
    `;

    res.status(201).json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/:id/questions  (Seller / Admin)
// Returns all questions for a product, with answers joined in
export const getQuestionsByProduct = async (req, res) => {
  try {
    const { id: product_id } = req.params;

    const questions = await sql`
      SELECT
        q.*,
        u.name            AS buyer_name,
        a.answer_id,
        a.answer_text,
        a.created_at      AS answer_date,
        s.store_name      AS answered_by_store
      FROM questions q
      JOIN users u ON q.buyer_id = u.user_id
      LEFT JOIN answers a ON q.question_id = a.question_id
      LEFT JOIN sellers s ON a.seller_id  = s.seller_id
      WHERE q.product_id = ${product_id}
      ORDER BY q.created_at DESC
    `;

    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/questions  (Seller only)
// Returns all questions for all products owned by the logged-in seller
// Supports ?answered=false to filter unanswered ones
export const getSellerQuestions = async (req, res) => {
  try {
    const seller_id = req.user.user_id;
    const { answered } = req.query;

    const questions = await sql`
      SELECT
        q.*,
        u.name       AS buyer_name,
        p.name       AS product_name,
        a.answer_id,
        a.answer_text,
        a.created_at AS answer_date
      FROM questions q
      JOIN users    u ON q.buyer_id   = u.user_id
      JOIN products p ON q.product_id = p.product_id
      LEFT JOIN answers a ON q.question_id = a.question_id
      WHERE p.seller_id = ${seller_id}
      ${answered === "false" ? sql`AND a.answer_id IS NULL` : sql``}
      ORDER BY q.created_at DESC
    `;

    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/questions?answered=false  (Admin dashboard)
// When answered=false, returns only unanswered questions
export const getAllQuestions = async (req, res) => {
  try {
    const { answered } = req.query;

    const questions = await sql`
      SELECT
        q.*,
        u.name  AS buyer_name,
        p.name  AS product_name,
        a.answer_id,
        a.answer_text,
        a.created_at AS answer_date
      FROM questions q
      JOIN users    u ON q.buyer_id   = u.user_id
      JOIN products p ON q.product_id = p.product_id
      LEFT JOIN answers a ON q.question_id = a.question_id
      ${answered === "false" ? sql`WHERE a.answer_id IS NULL` : sql``}
      ORDER BY q.created_at DESC
    `;

    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/questions/:id/answer  (Seller / Admin)
export const answerQuestion = async (req, res) => {
  try {
    const { id: question_id } = req.params;
    const { answer_text } = req.body;
    const seller_id = req.user.user_id;
    const [question] = await sql`
      SELECT * FROM questions WHERE question_id = ${question_id}
    `;
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found." });
    }

    // If seller, verify they own the product being asked about
    if (req.user.role === "seller") {
      const [ownership] = await sql`
        SELECT p.product_id FROM products p
        WHERE p.product_id = ${question.product_id}
          AND p.seller_id  = ${seller_id}
      `;
      if (!ownership) {
        return res.status(403).json({
          success: false,
          message: "You can only answer questions about your own products.",
        });
      }
    }

    // answers.question_id is UNIQUE, so this will fail if already answered
    const [answer] = await sql`
      INSERT INTO answers (question_id, seller_id, answer_text)
      VALUES (${question_id}, ${seller_id}, ${answer_text.trim()})
      RETURNING *
    `;

    res.status(201).json({ success: true, data: answer });
  } catch (error) {
    // Postgres unique-violation code
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "This question has already been answered. Use PUT to edit it.",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/questions/:id/answer  (Admin / Seller who answered)
export const editAnswer = async (req, res) => {
  try {
    const { id: question_id } = req.params;
    const { answer_text } = req.body;
    const seller_id = req.user.user_id;

    if (!answer_text?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Answer text is required." });
    }

    const [existing] = await sql`
      SELECT * FROM answers WHERE question_id = ${question_id}
    `;
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Answer not found." });
    }

    // Sellers may only edit their own answers; admins can edit any
    if (req.user.role === "seller" && existing.seller_id !== seller_id) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own answers.",
      });
    }

    const [updated] = await sql`
      UPDATE answers
      SET answer_text = ${answer_text.trim()}
      WHERE question_id = ${question_id}
      RETURNING *
    `;

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/questions/:id  (Admin / Buyer who asked)
export const deleteQuestion = async (req, res) => {
  try {
    const { id: question_id } = req.params;

    const [question] = await sql`
      SELECT * FROM questions WHERE question_id = ${question_id}
    `;
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found." });
    }

    // Buyers may only delete their own questions; admins can delete any
    if (
      req.user.role === "buyer" &&
      question.buyer_id !== req.user.user_id
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own questions.",
      });
    }

    await sql`DELETE FROM questions WHERE question_id = ${question_id}`;

    res.json({ success: true, message: "Question deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/questions/:id/answer  (Admin / Seller who answered)
export const deleteAnswer = async (req, res) => {
  try {
    const { id: question_id } = req.params;
    const seller_id = req.user.user_id;

    const [answer] = await sql`
      SELECT * FROM answers WHERE question_id = ${question_id}
    `;
    if (!answer) {
      return res
        .status(404)
        .json({ success: false, message: "Answer not found." });
    }

    if (req.user.role === "seller" && answer.seller_id !== seller_id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own answers.",
      });
    }

    await sql`DELETE FROM answers WHERE question_id = ${question_id}`;

    res.json({ success: true, message: "Answer deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};