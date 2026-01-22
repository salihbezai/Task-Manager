    import mongoose from "mongoose";

    const todoSchema = new mongoose.Schema({
        text: { type: String, required: true },
        completed: { type: Boolean, default: false },
    })

    export interface ITask {
        title: string;
        description?: string;
        priority?: "low" | "medium" | "high";
        status: "pending" | "in-progress" | "completed";
        dueDate?: Date;
        assignedTo?: mongoose.Types.ObjectId[];
        createdBy?: mongoose.Types.ObjectId;
        attachments?: string[];
        todos: { text: string; completed: boolean }[];
        progress: number
    }


    const taskSchema = new mongoose.Schema<ITask>({
        title: { type: String, required: true },
        description: { type: String },
        priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
        status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
        dueDate: { type: Date },
        assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        attachments: [{ type: String }],
        todos: [todoSchema],
        progress: { type: Number, default: 0 },
    },
    { timestamps: true, versionKey: false }
    );

    export default mongoose.model("Task", taskSchema);