import express from "express";
import { getAllProducts, createProduct, deleteProduct, updateProduct, updateProductStock } from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import sellerOnly from "../middleware/sellerOnly.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", authMiddleware, sellerOnly, createProduct);
router.patch("/:productId", authMiddleware, sellerOnly, updateProduct);
router.delete("/:productId", authMiddleware, sellerOnly, deleteProduct);
router.put("/:productId/stock", authMiddleware, sellerOnly, updateProductStock);

export default router;