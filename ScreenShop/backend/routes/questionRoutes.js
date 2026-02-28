import express from "express";
import {
  getAllQuestions,
  answerQuestion,
  editAnswer,
  deleteQuestion,
  deleteAnswer,
} from "../controllers/questionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";
import sellerOrAdmin from "../middleware/sellerOrAdmin.js";

const router = express.Router();

// GET /api/questions?answered=false  — admin dashboard
router.get("/", authMiddleware, adminOnly, getAllQuestions);

// POST /api/questions/:id/answer  — seller answers a question
router.post("/:id/answer", authMiddleware, sellerOrAdmin, answerQuestion);

// PUT /api/questions/:id/answer  — seller edits an answer
router.put("/:id/answer", authMiddleware, sellerOrAdmin, editAnswer);

// DELETE /api/questions/:id/answer  — seller or admin deletes an answer
router.delete("/:id/answer", authMiddleware, sellerOrAdmin, deleteAnswer);

// DELETE /api/questions/:id  — buyer (own question(s)) or admin
// No role middleware here: both buyer and admin are allowed,
// ownership check is handled inside the controller
router.delete("/:id", authMiddleware, deleteQuestion);

export default router;