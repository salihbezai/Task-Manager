import { createSlice, type PayloadAction } from "@reduxjs/toolkit";



// interface ITask 
// interface ITask {
//     title: string;
//     description?: string;
//     priority?: "low" | "medium" | "high";
//     status: "pending" | "in-progress" | "completed";
//     dueDate?: Date;
//     assignedTo?: mongoose.Types.ObjectId[];
//     createdBy?: mongoose.Types.ObjectId;
//     attachments?: string[];
//     todos: { text: string; completed: boolean }[];
//     text: string;
//     completed: boolean;
//     progress: number;
// }
// interface taskState {
interface TaskStatus {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    tasks: ITask[],
    error: string | null,
    loading: boolean
}


    const initialState: TaskStatus = {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        tasks: [],
        error: null,
        loading: false
    }

    
    const taskSlice = createSlice({
        name: "task",
        initialState,
        reducers: { 
          clearError(state) { 
            state.error = null;
          },
        },
        extraReducers: (builder) => {
           // fetch dashboard data
           builder.addCase('task/fetchDashboardData/pending', (state) => {
            state.loading = true;
            state.error = null;
           })
              builder.addCase('task/fetchDashboardData/fulfilled', (state, action: PayloadAction<userType>) => {
                state.loading = false;
                state.totalTasks = action.payload.totalTasks;
                state.completedTasks = action.payload.completedTasks;
                state.pendingTasks = action.payload.pendingTasks;
                state.inProgressTasks = action.payload.inProgressTasks;
                state.error = null;
              })
              builder.addCase('task/fetchDashboardData/rejected', (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
              })
              // get all tasks
              builder.addCase('task/fetchAllTasks/pending', (state) => {
                state.loading = true;
                state.error = null;
               })
                  builder.addCase('task/fetchAllTasks/fulfilled', (state, action: PayloadAction<userType>) => {
                    state.loading = false;

                    state.error = null;
                  })
                  builder.addCase('task/fetchAllTasks/rejected', (state, action: PayloadAction<string>) => {
                    state.loading = false;
                    state.error = action.payload;
                  })

        }
    })


    


export const {  clearError } = taskSlice.actions;
export default taskSlice.reducer;