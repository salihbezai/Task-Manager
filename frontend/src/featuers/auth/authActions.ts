import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { getErrorMessage } from "../../utils/errorHelper";
import type { userType } from "./userTypes";



// fetch logged in user
const fetchCurrentUser = createAsyncThunk<
  userType,
  void,
  { rejectValue: string }
>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/auth/me");
    return data;
  } catch (error: unknown) {
    rejectWithValue(getErrorMessage(error));
  }
});

// login user thunk
const loginUser = createAsyncThunk<
  userType,
  { email: string; password: string },
  { rejectValue: string }
>(
  "auth/loginUser",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      return data;
    } catch (error: unknown) {
      rejectWithValue(getErrorMessage(error));
    }
  },
);

// signup user thunk
const registerUser = createAsyncThunk<
  userType,
  {
    name: string;
    email: string;
    password: string;
    profileImageUrl?: string;
    inviteToken: string;
  },
  { rejectValue: string }
>(
  "auth/signupUser",
  async (
    credentials: {
      name: string;
      email: string;
      password: string;
      profileImageUrl?: string;
      inviteToken: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.post("/auth/register", credentials);
      return data;
    } catch (error: unknown) {
      rejectWithValue(getErrorMessage(error));
    }
  },
);

// logout user
const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.get("/auth/logout");
      return;
    } catch (error: unknown) {
      rejectWithValue(getErrorMessage(error));
    }
  },
);

export { fetchCurrentUser, loginUser, registerUser, logoutUser };
