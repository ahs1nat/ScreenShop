import express from "express";
import {
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserRole,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

// Admin-only routes
router.get("/", authMiddleware, adminOnly, getAllUsers);
router.get("/:id", authMiddleware, adminOnly, getUserById);
router.delete("/:id", authMiddleware, adminOnly, deleteUser);
router.put("/:id/role", authMiddleware, adminOnly, updateUserRole);

export default router;
