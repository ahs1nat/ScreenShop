import express from "express";
import {
  addToCart,
  viewCart,
  updateCart,
  removeCartItem
} from "../controllers/cartController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/", addToCart); // checked but some improvements needed
router.get("/", viewCart); // checked
router.patch("/:itemId", updateCart);
router.delete("/:itemId", removeCartItem);

export default router;
