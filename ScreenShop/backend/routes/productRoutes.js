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
import { getCategories } from "../controllers/adminController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/new-arrivals", getNewArrivals);
router.get("/top-products", getTopProducts);
router.get("/top-sellers", getTopSellers);
router.get("/", getAllProducts);

router.get("/questions", authMiddleware, sellerOnly, getSellerQuestions);

router.get("/:productId", getProductById);
router.post("/:id/questions", authMiddleware, buyerOnly, askQuestion);

router.get("/:id/questions", authMiddleware, sellerOrAdmin, getQuestionsByProduct);

export default router;
