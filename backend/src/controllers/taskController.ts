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
        try {
            throw new Error("Simulated error for testing logging");
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

     