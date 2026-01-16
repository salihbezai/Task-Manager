import { createSlice, type PayloadAction } from "@reduxjs/toolkit";




interface userType {
    _id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
    role: "member" | "admin";
    createdAt?: Date;
    updatedAt?: Date;
}




    const initialState = {
        users: [],
        loading: false,
        error: null,
    }

    
    const authSlice = createSlice({
        name: "user",
        initialState,
        reducers: { 
          clearError(state) { 
            state.error = null;
          },
        },
        extraReducers: (builder) => {
           // fetch users
           builder.addCase('user/fetchUsers/pending', (state) => {
            state.loading = true;
            state.error = null;
           })
              builder.addCase('user/fetchUsers/fulfilled', (state, action: PayloadAction<userType>) => {
                state.loading = false;
                state.users = action.payload;
                state.error = null;
              })
              builder.addCase('user/fetchUsers/rejected', (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
              })

        }
    })


    


export const { clearLoginError, clearRegisterError, clearError } = authSlice.actions;
export default authSlice.reducer;