import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  createTask,
  deleteTask,
  downloadTasksCSV,
  fetchAllTasks,
  fetchTaskById,
  getDashboardData,
  updateTask,
} from "./taskActions";

interface Task {
  id: string;
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
  createdAt?: Date;
}

interface TaskState {
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

const initialState: TaskState = {
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
  inProgressTasks: 0,
  tasks: [],
  selectedTask: null,
  updatedTask: null,
  error: null,
  loading: false,
  createTaskLoading: false,
  selectedLoadingTask: false,
  updateTaskLoading: false,
  updateTaskError: null,
  createTaskError: null,
  selectedErrorTask: null,
  createdTask: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearErrorCreateTask(state) {
      state.createTaskError = null;
    },
    clearErrorSelectedTask(state) {
      state.selectedErrorTask = null;
    },
  },
  extraReducers: (builder) => {
    // fetch dashboard data
    builder.addCase(getDashboardData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getDashboardData.fulfilled, (state, action) => {
      state.loading = false;
      state.totalTasks = action.payload.totalTasks;
      state.completedTasks = action.payload.completedTasks;
      state.pendingTasks = action.payload.pendingTasks;
      state.inProgressTasks = action.payload.inProgressTasks;
      state.error = null;
    });
    builder.addCase(getDashboardData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // get all tasks
    builder.addCase(fetchAllTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = action.payload;
      state.error = null;
    });
    builder.addCase(fetchAllTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // create task
    builder.addCase(createTask.pending, (state) => {
      state.createTaskLoading = true;
      state.createTaskError = null;
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.createTaskLoading = false;
      state.createdTask = action.payload;
      state.createTaskError = null;
    });
    builder.addCase(createTask.rejected, (state, action) => {
      state.createTaskLoading = false;
      state.createTaskError = "Something went wrong, please try again.";
    });
    // get task by id
    builder.addCase(fetchTaskById.pending, (state) => {
      state.selectedLoadingTask = true;
      state.selectedErrorTask = null;
    });
    builder.addCase(fetchTaskById.fulfilled, (state, action) => {
      state.selectedLoadingTask = false;
      state.selectedTask = action.payload;
      state.selectedErrorTask = null;
    });
    builder.addCase(fetchTaskById.rejected, (state, action) => {
      state.selectedLoadingTask = false;
      state.selectedErrorTask = action.payload;
    });
    // update task
    builder.addCase(updateTask.pending, (state) => {
      state.updateTaskLoading = true;
      state.updateTaskError = null;
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      state.updateTaskLoading = false;
      state.updatedTask = action.payload;
      // also update the task in the tasks array
      const index = state.tasks.findIndex(
        (task) => task._id === action.payload._id,
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      state.updateTaskError = null;
    });
    builder.addCase(updateTask.rejected, (state, action) => {
      state.updateTaskLoading = false;
      state.updateTaskError = action.payload;
    })
    // delete task
    builder.addCase(deleteTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.loading = false;
      const deletedTaskId = action.payload.id;
      state.tasks = state.tasks.filter((task) => task._id !== deletedTaskId);
      state.error = null;
    });
    builder.addCase(deleteTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // download task report as CSV
    builder.addCase(downloadTasksCSV.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(downloadTasksCSV.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(downloadTasksCSV.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError, clearErrorCreateTask, clearErrorSelectedTask } =
  taskSlice.actions;
export default taskSlice.reducer;
