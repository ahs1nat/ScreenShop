import express from "express";
import { placeOrder, viewOrders, updateOrderStatus, cancelOrder, getMyOrders, getOrderItems } from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
// import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

router.post("/", authMiddleware, placeOrder); // checked
router.get("/", authMiddleware, viewOrders); // checked
router.get("/my-orders", authMiddleware, getMyOrders); // checked

router.get("/:id/items", authMiddleware, getOrderItems);

router.patch("/:id/status", authMiddleware, updateOrderStatus); //checked
router.patch("/:id/cancel", authMiddleware, cancelOrder); // checked

export default router;
