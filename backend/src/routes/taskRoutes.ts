import { Router } from "express";
import { createTask, deleteTask, 
    getDashboardData, getTaskById, getTasks,
     getUserDashboardData, updateTask, 
     updateTaskCheckList, updateTaskStatus } from "../controllers/taskController";
import { adminOnly } from "../middlewares/authMiddleware";


const router = Router()

// dashboard data
router.get("/dashboard-data",getDashboardData)

// user dashboard data
router.get("/user-dashboard-data",getUserDashboardData)


// create task
router.post("/create",adminOnly,createTask)

// get tasks
router.get("/",adminOnly,getTasks)

// get task by id 
router.get("/:id",getTaskById)

// update task
router.put("/update/:id", updateTask)

// delete task 
router.delete("/delete/:id",adminOnly,deleteTask)

// update task status
router.put("/:id/status",updateTaskStatus)

// update task check list
router.put("/:id/todo",updateTaskCheckList)






export default router