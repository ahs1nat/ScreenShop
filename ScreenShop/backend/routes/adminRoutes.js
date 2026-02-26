import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";
import {
  getAdminStats,
  getTopSellers,
  getTopProducts,
  getAllStores,
  getAllPendingStores,
  deleteStore,
  approveProduct,
  approveStore,
  getAllProducts,
  getAllPendingProducts,
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

router.get("/stats", authMiddleware, adminOnly, getAdminStats);
router.get("/top-sellers", authMiddleware, adminOnly, getTopSellers);
router.get("/top-products", authMiddleware, adminOnly, getTopProducts);

router.get("/stores", authMiddleware, adminOnly, getAllStores); // checked
router.get("/stores/pending", authMiddleware, adminOnly, getAllPendingStores); // checked
router.delete("/stores/:id", authMiddleware, adminOnly, deleteStore);
router.patch("/stores/:id/approve", authMiddleware, adminOnly, approveStore); //checked

router.get("/products", authMiddleware, adminOnly, getAllProducts); // checked
router.get("/products/pending", authMiddleware, adminOnly, getAllPendingProducts); // checked
router.patch("/products/:productId/approve", authMiddleware, adminOnly, approveProduct); // checked
router.delete("/products/:id", authMiddleware, adminOnly, deleteProduct); // unchecked, hope 

router.get("/categories", authMiddleware, adminOnly, getCategories); // checked
router.post("/categories", authMiddleware, adminOnly, addCategory); // checked
router.put("/categories/:id", authMiddleware, adminOnly, editCategory); // checked
router.delete("/categories/:id", authMiddleware, adminOnly, deleteCategory); // checked

router.get("/discounts", authMiddleware, adminOnly, getDiscounts);
router.post("/discounts", authMiddleware, adminOnly, addDiscount);
router.put("/discounts/:id", authMiddleware, adminOnly, editDiscount);
router.delete("/discounts/:id", authMiddleware, adminOnly, deleteDiscount);

export default router;
