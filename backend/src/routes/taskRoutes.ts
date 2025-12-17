import { Router } from "express";
import { createTask, deleteTask, updateTask } from "../controllers/taskController";


const router = Router()

// create task
router.post("/create",createTask)

// update task
router.put("/update/:id",updateTask)

// delete task 
router.delete("/delete/:id",deleteTask)


export default router