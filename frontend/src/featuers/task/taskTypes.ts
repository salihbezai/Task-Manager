
export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  dueDate?: Date;
  assignedTo?: string[];
  createdBy?: string;
  attachments?: string[];
  todos: { text: string; completed: boolean }[];
  progress: number;
  createdAt?: Date ;
  updatedAt?: Date;
}

 export interface TaskState {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  tasks: Task[];
  selectedTask: Task | null;
  updatedTask: Task | null;
  error: string | null;
  loading: boolean;
  createTaskLoading: boolean;
  updateTaskLoading: boolean;
  updateTaskError: string | null;
  selectedLoadingTask: boolean;
  createTaskError: string | null;
  selectedErrorTask: string | null;
  createdTask: Task | null;
}


export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "in-progress" | "completed";
  dueDate?: string;          // sending as ISO string from <input type="date">
  assignedTo?: string[];
  todos?: { text: string }[];
  attachments?: string[];
}
export interface UpdateTaskPayload {
  _id: string;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "in-progress" | "completed";
  dueDate?: string;          // sending as ISO string from <input type="date">
  assignedTo?: string[];
  todos?: { text: string, completed: boolean }[];
  attachments?: string[];
}
