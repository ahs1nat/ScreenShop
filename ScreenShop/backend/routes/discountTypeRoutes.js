import express from "express";
import {
    createDiscountType,
    getAllDiscountTypes,
    updateDiscountType,
    deleteDiscountType,
} from "../controllers/discountTypeContrller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";
import sellerOrAdmin from "../middleware/sellerOrAdmin.js";

const router = express.Router();

router.post("/", authMiddleware, sellerOrAdmin, createDiscountType);
router.get("/", authMiddleware, getAllDiscountTypes);
router.put("/:id", authMiddleware, adminOnly, updateDiscountType);
router.delete("/:id", authMiddleware, adminOnly, deleteDiscountType);

export default router;