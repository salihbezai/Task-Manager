import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../featuers/auth/authSlice";
import taskReducer from "../featuers/task/taskSlice";
import userReducer from "../featuers/user/userSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
