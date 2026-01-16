import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createTask, fetchAllTasks, getDashboardData } from "./taskActions";

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
  error: string | null;
  loading: boolean;
  createTaskLoading: boolean;
  createTaskError: string | null;
  createdTask: Task | null;
}


const initialState: TaskState = {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    tasks: [],
    error: null,
    loading: false,
    createTaskLoading: false,
    createTaskError: null,
    createdTask: null
}
    
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
        },
        extraReducers: (builder) => {
           // fetch dashboard data
           builder.addCase(getDashboardData.pending, (state) => {
            state.loading = true;
            state.error = null;
           })
              builder.addCase(getDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.totalTasks = action.payload.totalTasks;
                state.completedTasks = action.payload.completedTasks;
                state.pendingTasks = action.payload.pendingTasks;
                state.inProgressTasks = action.payload.inProgressTasks;
                state.error = null;
              })
              builder.addCase(getDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              })
              // get all tasks
              builder.addCase(fetchAllTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
               })
                  builder.addCase(fetchAllTasks.fulfilled, (state, action) => {
                    state.loading = false;
                    state.tasks = action.payload;
                    state.error = null;
                  })
                  builder.addCase(fetchAllTasks.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                  })
                  // create task
                  builder.addCase(createTask.pending, (state) => {
                    state.createTaskLoading = true;
                    state.createTaskError = null;
                   })
                      builder.addCase(createTask.fulfilled, (state, action) => {
                        state.createTaskLoading = false;
                        state.createdTask = action.payload;
                        state.createTaskError = null;
                      })
                      builder.addCase(createTask.rejected, (state, action) => {
                        state.createTaskLoading = false;
                        state.createTaskError = "Something went wrong, please try again.";
                      })

        }
    })


    


export const {  clearError } = taskSlice.actions;
export default taskSlice.reducer;