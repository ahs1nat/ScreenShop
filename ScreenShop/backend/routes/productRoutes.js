import express from "express";
import {
  getAllProducts,
  getNewArrivals,
  getTopProducts,
  getTopSellers,
  getProductById,
} from "../controllers/productController.js";

import {
  askQuestion,
  getQuestionsByProduct,
  getSellerQuestions,
} from "../controllers/questionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import buyerOnly from "../middleware/buyerOnly.js";
import sellerOrAdmin from "../middleware/sellerOrAdmin.js";
import sellerOnly from "../middleware/sellerOnly.js";

const router = express.Router();

// ── Product listing routes ────────────────────────────────────────────────────
router.get("/new-arrivals", getNewArrivals);
router.get("/top-products", getTopProducts);
router.get("/top-sellers", getTopSellers);
router.get("/", getAllProducts); // public — buyers browsing

// GET /api/products/questions  — seller sees all questions across their products
// Must be defined BEFORE /:productId, otherwise Express reads "questions" as a productId
router.get("/questions", authMiddleware, sellerOnly, getSellerQuestions);


router.get("/:productId", getProductById);
// ── Product-scoped question routes ───────────────────────────────────────────
// authenticated buyers only
router.post("/:id/questions", authMiddleware, buyerOnly, askQuestion);

// seller or admin only
router.get("/:id/questions", authMiddleware, sellerOrAdmin, getQuestionsByProduct);

export default router;
