import { createSlice, type PayloadAction } from "@reduxjs/toolkit";




// interface taskState {



    const initialState = {
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
                    state.tasks = action.payload;
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