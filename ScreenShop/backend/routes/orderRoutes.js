import express from "express";
import { placeOrder, viewOrders, updateOrderStatus, cancelOrder, getMyOrders } from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
// import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

router.post("/", authMiddleware, placeOrder);
router.get("/", authMiddleware, viewOrders);
router.get("/my-orders", authMiddleware, getMyOrders);

router.patch("/:id/status", authMiddleware, updateOrderStatus);
router.patch("/:id/cancel", authMiddleware, cancelOrder);

export default router;
