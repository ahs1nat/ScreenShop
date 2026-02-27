import express from "express";
import {
  getAllProducts,
  getNewArrivals,
  getTopProducts,
  getTopSellers,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/new-arrivals", getNewArrivals);
router.get("/top-products", getTopProducts);
router.get("/top-sellers", getTopSellers);
router.get("/:productId", getProductById);

router.get("/", getAllProducts); // public — buyers browsing

export default router;
