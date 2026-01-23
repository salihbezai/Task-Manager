import { createSlice } from "@reduxjs/toolkit";
import { downloadUsersCSV, fetchUsers } from "./userActions";
import type { User, userState } from "./userTypes";

const initialState: userState = {
  users: [] as User[],
  loading: false,
  error: null,
};

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
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
      state.error = null;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? null;
    });
    // download users CSV
    builder.addCase(downloadUsersCSV.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(downloadUsersCSV.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(downloadUsersCSV.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? null;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
