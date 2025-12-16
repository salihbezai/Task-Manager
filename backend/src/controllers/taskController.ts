import { Request, Response } from "express";
import Task from "../models/Task";


export interface TaskRequestBody {
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    status?: "pending" | "in-progress" | "completed";
    dueDate?: Date;
    assignedTo?: string;
    createdBy?: string;
    attachments?: string[];
    todos?: { text: string; completed: boolean }[];
    progress?: number;
}

export const createTask = async (req: Request, res: Response): Promise<void> => {
    const { title, description, priority, status, dueDate,
         assignedTo, attachments, todos,progress } = req.body as TaskRequestBody;
       
        if(!title){
            return res.status(400).json({message: "Title is required"})
        }
        try {
              const createdTask = await Task.create(
            {
            title,
            description,
            priority,
            status,
            dueDate,
            assignedTo: assignedTo || req.user?.id,
            createdBy: req.user?.id,
            attachments,
            todos,
            progress,
        }
        );
        res.status(201).json(createdTask); 
        } catch (error) {
            console.error("Error creating task:", error);
            res.status(500).json({ message: "Failed to create task" });
        }
     
}


     