import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";
import {
  getAllStores,
  deleteStore,
  getAllProducts,
  deleteProduct,
  getCategories,
  addCategory,
  editCategory,
  deleteCategory,
  getDiscounts,
  addDiscount,
  editDiscount,
  deleteDiscount,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stores", authMiddleware, adminOnly, getAllStores);
router.delete("/stores/:id", authMiddleware, adminOnly, deleteStore);

router.get("/products", authMiddleware, adminOnly, getAllProducts);
router.delete("/products/:id", authMiddleware, adminOnly, deleteProduct);

router.get("/categories", authMiddleware, adminOnly, getCategories);
router.post("/categories", authMiddleware, adminOnly, addCategory);
router.put("/categories/:id", authMiddleware, adminOnly, editCategory);
router.delete("/categories/:id", authMiddleware, adminOnly, deleteCategory);

router.get("/discounts", authMiddleware, adminOnly, getDiscounts);
router.post("/discounts", authMiddleware, adminOnly, addDiscount);
router.put("/discounts/:id", authMiddleware, adminOnly, editDiscount);
router.delete("/discounts/:id", authMiddleware, adminOnly, deleteDiscount);

export default router;
