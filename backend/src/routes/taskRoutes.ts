import { Router } from "express";
import { createTask } from "../controllers/taskController";


const router = Router()

router.post("/create",createTask)

export default router