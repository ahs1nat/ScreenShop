import express from "express";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct
} from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import sellerOnly from "../middleware/sellerOnly.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", authMiddleware, sellerOnly, createProduct);
router.patch("/:productId", authMiddleware, sellerOnly, updateProduct);
router.delete("/:productId", authMiddleware, sellerOnly, deleteProduct);

export default router;