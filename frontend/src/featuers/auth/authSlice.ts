import { createSlice, type PayloadAction } from "@reduxjs/toolkit";



interface userType {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: null | { id: string; name: string; email: string; role: string; token: string};
    loading: boolean;
    error: null | string;
    loginError: null | string;
    loginLoading: boolean;
    registerError: null | string;
    registerLoading: boolean

}


    const initialState: AuthState = {
        user: null,
        loading: false,
        error: null,
        loginError: null,
        loginLoading: false,
        registerError: null,
        registerLoading: false
    }

    
    const authSlice = createSlice({
        name: "auth",
        initialState,
        reducers: { 
         
          clearLoginError(state) { 
            state.loginError = null;
          },
          clearRegisterError(state) { 
            state.registerError = null;
          },
          clearError(state) { 
            state.error = null;
          },
        },
        extraReducers: (builder) => {
           // fetch current user 
           builder.addCase('auth/fetchCurrentUser/pending', (state) => {
            state.loading = true;
            state.error = null;
           })
              builder.addCase('auth/fetchCurrentUser/fulfilled', (state, action: PayloadAction<userType>) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
              })
              builder.addCase('auth/fetchCurrentUser/rejected', (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
              })

              // login user
              builder.addCase('auth/loginUser/pending', (state) => {
                state.loginLoading = true;
                state.loginError = null;
               })
                  builder.addCase('auth/loginUser/fulfilled', (state, action: PayloadAction<userType>) => {
                    state.loginLoading = false;
                    state.user = action.payload;
                    state.loginError = null;
                  })
                  builder.addCase('auth/loginUser/rejected', (state, action: PayloadAction<string>) => {
                    state.loginLoading = false;
                    state.loginError = action.payload;
                  })

                  // Signup
                  builder.addCase('auth/signupUser/pending', (state) => {
                    state.registerLoading = true;
                    state.registerError = null;
                   })
                      builder.addCase('auth/signupUser/fulfilled', (state, action: PayloadAction<userType>) => {
                        state.registerLoading = false;
                        state.user = action.payload;
                        state.registerError = null;
                      })
                      builder.addCase('auth/signupUser/rejected', (state, action: PayloadAction<string>) => {
                        state.registerLoading = false;
                        state.registerError = action.payload;
                      })


        }
    })


    


export const { clearLoginError, clearRegisterError, clearError } = authSlice.actions;
export default authSlice.reducer;