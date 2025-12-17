import { Router } from "express";
import { createTask, updateTask } from "../controllers/taskController";


const router = Router()

// create task
router.post("/create",createTask)

// update task
router.put("/update/:id",updateTask)
export default router