import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getBuyerProfile,
  updateBuyerProfile,
} from "../controllers/buyerController.js";

const router = express.Router();

router.get("/profile", authMiddleware, getBuyerProfile);
router.put("/profile", authMiddleware, updateBuyerProfile);

export default router;
