import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
} from "./authActions";
import type { userType } from "./userTypes";

interface AuthState {
  user: null | userType;
  token: null | string;
  loading: boolean;
  error: null | string;
  loginError: null | string;
  loginLoading: boolean;
  refreshLoading: boolean;
  registerError: null | string;
  registerLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
  error: null,
  loginError: null,
  loginLoading: false,
  refreshLoading: false,
  registerError: null,
  registerLoading: false,
};

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
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? null;
    });

    // login user
    builder.addCase(loginUser.pending, (state) => {
      state.loginLoading = true;
      state.loginError = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loginLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loginError = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loginLoading = false;
      state.loginError = action.payload ?? null;
    });

    // Signup
    builder.addCase(registerUser.pending, (state) => {
      state.registerLoading = true;
      state.registerError = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.registerLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.registerError = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.registerLoading = false;
      state.registerError = action.payload ?? null;
    });
    // refresh token
    builder.addCase(refreshToken.pending, (state) => {
      state.refreshLoading = true;
    });
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.refreshLoading = false;
      state.token = action.payload.token;
    });
    builder.addCase(refreshToken.rejected, (state) => {
      state.token = null;
      state.refreshLoading = false;
    });

    // logout user
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.error = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.error = action.payload ?? null;
    });
  },
});

export const { clearLoginError, clearRegisterError, clearError } =
  authSlice.actions;
export default authSlice.reducer;
