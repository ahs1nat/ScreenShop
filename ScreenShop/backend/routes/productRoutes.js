import expres from "express";
import { createProduct, getAllProducts } from "../controllers/productController.js";

const router = expres.Router();

router.get("/", getAllProducts);

router.post("/", createProduct);

export default router;