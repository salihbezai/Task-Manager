import { Router } from "express";
import {
  deleteUserById,
  getUserById,
  getUsers,
} from "../controllers/userController";
import { adminOnly, protect } from "../middlewares/authMiddleware";

const router = Router();

// get users
router.get("/", protect, getUsers);

// GET USER BY ID
router.get("/:id", protect, getUserById);

// Delete user by id (admin only)
router.delete("/delete/:id", protect, adminOnly, deleteUserById);

export default router;
