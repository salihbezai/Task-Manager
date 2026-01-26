import { Router } from "express";
import {
  createTask,
  deleteTask,
  getDashboardData,
  getTaskById,
  getTasks,
  getUserDashboardData,
  getUserTasks,
  updateTask,
  updateTaskCheckList,
  updateTaskStatus,
} from "../controllers/taskController";
import { adminOnly, protect } from "../middlewares/authMiddleware";

const router = Router();

// dashboard data
router.get("/dashboard-data", protect, getDashboardData);

// user dashboard data
router.get("/user-dashboard-data", protect, getUserDashboardData);

// create task
router.post("/create", protect, adminOnly, createTask);

// get tasks for admin
router.get("/", protect, adminOnly, getTasks);

// get tasks for user
router.get("/user-tasks", protect, getUserTasks);

// get task by id
router.get("/:id", protect, getTaskById);

// update task
router.put("/update/:id", protect, updateTask);

// delete task
router.delete("/delete/:id", protect, adminOnly, deleteTask);

// update task status
router.put("/:id/status", protect, updateTaskStatus);

// update task check list
router.put("/:id/todo", protect, updateTaskCheckList);

export default router;
