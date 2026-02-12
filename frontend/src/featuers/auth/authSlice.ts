import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  uploadImage,
} from "./authActions";
import type { userType } from "./userTypes";

interface AuthState {
  user: null | userType;
  loading: boolean;
  error: null | string;
  loginError: null | string;
  loginLoading: boolean;
  registerError: null | string;
  registerLoading: boolean;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  loginError: null,
  loginLoading: false,
  registerError: null,
  registerLoading: false,
  initialized: false,
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
      state.registerError = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.registerLoading = false;
      state.registerError = action.payload ?? null;
    });
    //  refresh token
    builder.addCase(refreshToken.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.loading = false;
      state.initialized = true;
    });

    builder.addCase(refreshToken.rejected, (state) => {
      state.loading = false;
      state.initialized = true;
      state.user = null;
    });
    // upload image
    builder.addCase(uploadImage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(uploadImage.fulfilled, (state, action) => {
      state.loading = false;
      if (state.user) {
        console.log("changed here as well")
        state.user.profileImageUrl = action.payload;
        console.log("state user.profileimage "+state.user.profileImageUrl)
      }
      state.error = null;
    });
    builder.addCase(uploadImage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? null;
    });

    // logout user
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.error = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? null;
    });
  },
});

export const { clearLoginError, clearRegisterError, clearError } =
  authSlice.actions;
export default authSlice.reducer;
