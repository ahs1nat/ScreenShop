import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import sellerOnly from "../middleware/sellerOnly.js";
import {
  getSellerStats,
  getSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  updateProductStock,
} from "../controllers/sellerController.js";
import { getCategories } from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", authMiddleware, sellerOnly, getSellerStats);

router.get("/products", authMiddleware, sellerOnly, getSellerProducts);
router.post("/products", authMiddleware, sellerOnly, createSellerProduct);
router.put(
  "/products/:productId",
  authMiddleware,
  sellerOnly,
  updateSellerProduct,
);
router.delete(
  "/products/:productId",
  authMiddleware,
  sellerOnly,
  deleteSellerProduct,
);
router.put(
  "/products/:productId/stock",
  authMiddleware,
  sellerOnly,
  updateProductStock,
);

// Reuse admin categories endpoint for dropdown
router.get("/categories", authMiddleware, sellerOnly, getCategories);

export default router;
