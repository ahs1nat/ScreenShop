import express from "express";
import {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    getAllReviewsAdmin,
    deleteAnyReview,
} from "../controllers/reviewsController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";
import buyerOnly from "../middleware/buyerOnly.js";

const router = express.Router();

router.post("/product/:productId", authMiddleware, buyerOnly, createReview);
router.get("/product/:productId", getProductReviews);
router.put("/product/:productId", authMiddleware, buyerOnly, updateReview);
router.delete("/product/:productId", authMiddleware, deleteReview);

router.get("/", authMiddleware, adminOnly, getAllReviewsAdmin); // filters: ?product_id= | ?seller_id= | ?rating=
router.delete("/:review_id", authMiddleware, adminOnly, deleteAnyReview);

export default router;