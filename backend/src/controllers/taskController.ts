import { Request, Response } from "express";
import mongoose from "mongoose";

import { logger } from "../utility";
import Task from "../models/Task";




export interface TaskRequestBody {
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    status?: "pending" | "in-progress" | "completed";
    dueDate?: Date;
    assignedTo?: mongoose.Types.ObjectId[];
    attachments?: string[];
    todos?: { text: string; completed: boolean }[];
    progress?: number;
}


// create task
export const createTask = async (req: Request, res: Response): Promise<void> => {
    const { title, description, priority, status, dueDate,
         assignedTo, attachments, todos,progress } = req.body as TaskRequestBody;
       
        if(!title){
             res.status(400).json({message: "Title is required"})
             return;
        }

        console.log("this object id "+req.user?.id)
        try {
              const task = new Task(
            {
            title,
            description,
            priority,
            status,
            dueDate,
            assignedTo: assignedTo?.map(id => new mongoose.Types.ObjectId(id)) 
            || [new mongoose.Types.ObjectId(req.user?.id)],
            createdBy: new mongoose.Types.ObjectId(req.user?.id),
            attachments,
            todos,
            progress,
        }
        );
        const createdTask = await task.save();
        res.status(201).json(createdTask); 
        } catch (error) {
            logger.error({
                message: "Error creating task",
                error: (error as Error).message,
                stack: (error as Error).stack,
                route: req.originalUrl
            })
            res.status(500).json({ message: "Failed to create task" });
        }
     
}


// update task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData = req.body as Partial<TaskRequestBody>;
    
    try {
        const task = await Task.findById(id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        // ownership check
        if (task.createdBy?.toString() !== req.user?.id) {
            res.status(403).json({ message: "You are not authorized to update this task" });
            return;
        }
        Object.assign(task, updateData);
        const updatedTask = await task.save()
        res.status(200).json(updatedTask);
    } catch (error) {
                logger.error({
                message: "Error updating task",
                error: (error as Error).message,
                stack: (error as Error).stack,
                route: req.originalUrl
            })
        res.status(500).json({ message: "Failed to update task" });
    }
}

// delete task 
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    const { id }  = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        // ownership check
        if (task.createdBy?.toString() !== req.user?.id) {
            res.status(403).json({ message: "You are not authorized to delete this task" });
            return;
        }
       await Task.findByIdAndDelete(id);
        res.status(200).json({ message: "Task deleted successfully" });
    }catch (error) {
                logger.error({
                message: "Error deleting task",
                error: (error as Error).message,
                stack: (error as Error).stack,
                route: req.originalUrl
            })
        res.status(500).json({ message: "Failed to delete task" });
    }
}

     

// get tasks
export const getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const tasks = await Task.find()
        .populate("createdBy", "name email profileImageUrl")
        .populate("assignedTo", "name email profileImageUrl");
        res.status(200).json(tasks);
    } catch (error) {
        logger.error({
            message: "Error fetching tasks",
            error: (error as Error).message,
            stack: (error as Error).stack,
            route: req.originalUrl
        })
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
}

// get task by id 
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.status(200).json(task);
    }catch (error) {
        logger.error({
            message: "Error fetching task by ID",
            error: (error as Error).message,
            stack: (error as Error).stack,
            route: req.originalUrl
        })
        res.status(500).json({ message: "Failed to fetch task" });
    }
}

// update task status
export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const  { status } = req.body;
    try {
        const task = await Task.findById(id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        // ownership check
        if (task.createdBy?.toString() !== req.user?.id) {
            res.status(403).json({ message: "You are not authorized to update this task" });
            return;
        }
        task.status = status;
        const updatedTask = await task.save()
        res.status(200).json(updatedTask);
    }catch (error) {
        logger.error({
            message: "Error updating task status",
            error: (error as Error).message,
            stack: (error as Error).stack,
            route: req.originalUrl
        })
        res.status(500).json({ message: "Failed to update task status" });
    }
}

// update task check list
export const updateTaskCheckList = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { todos } = req.body;
    try {
        const task = await Task.findById(id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        // ownership check
        if (task.createdBy?.toString() !== req.user?.id) {
            res.status(403).json({ message: "You are not authorized to update this task" });
            return;
        }
        task.todos = todos;
        const updatedTask = await task.save()
        res.status(200).json(updatedTask);
    }catch (error) {
        logger.error({
            message: "Error updating task checklist",
            error: (error as Error).message,
            stack: (error as Error).stack,
            route: req.originalUrl
        })
        res.status(500).json({ message: "Failed to update task checklist" });
    }
}

// get dashbaord data
export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ status: "completed" });
        const pendingTasks = await Task.countDocuments({ status: "pending" });
        const inProgressTasks = await Task.countDocuments({ status: "in-progress" });
        res.status(200).json({
            totalTasks,
            completedTasks,
            pendingTasks,
            inProgressTasks
        });


    } catch (error) {
        logger.error({
            message: "Error fetching dashboard data",
            error: (error as Error).message,
            stack: (error as Error).stack,
            route: req.originalUrl
        })
        res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
}

// get user dashbaord data
export const getUserDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const totalTasks = await Task.countDocuments({ createdBy: userId });
        const completedTasks = await Task.countDocuments({ createdBy: userId, status: "completed" });
        const pendingTasks = await Task.countDocuments({ createdBy: userId, status: "pending" });
        const inProgressTasks = await Task.countDocuments({ createdBy: userId, status: "in-progress" });
        res.status(200).json({
            totalTasks,
            completedTasks,
            pendingTasks,
            inProgressTasks
        });
    } catch (error) {
        logger.error({
            message: "Error fetching user dashboard data",
            error: (error as Error).message,
            stack: (error as Error).stack,
            route: req.originalUrl
        })
        res.status(500).json({ message: "Failed to fetch user dashboard data" });
    }
}