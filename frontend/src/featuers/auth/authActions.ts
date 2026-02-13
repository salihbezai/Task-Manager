import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { getErrorMessage } from "../../utils/errorHelper";
import type { loginResponse, registerResponse, userType } from "./userTypes";
import { toast } from "react-toastify";
import { clearAccessToken, getAccessToken, setAccessToken } from "../../api/tokenService";




// fetch logged in user
const fetchCurrentUser = createAsyncThunk<
  userType,
  void,
  { rejectValue: string }
>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/auth/me");
    return data.user;
  } catch (error: unknown) {
    rejectWithValue(getErrorMessage(error));
  }
});

// login user thunk
const loginUser = createAsyncThunk<
  loginResponse,
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
      setAccessToken(data.token);
      return data;
    } catch (error: unknown) {
      toast.error(error.response.data.message || "Something went wrong, please try again.");
      rejectWithValue(getErrorMessage(error));
    }
  },
);

// signup user thunk
const registerUser = createAsyncThunk<
  registerResponse,
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
      setAccessToken(data.token);
      return data;
    } catch (error: unknown) {
      toast.error(error.response.data.message || "Failed to register user, please try again.");
      rejectWithValue(getErrorMessage(error));
    }
  },
);
//  refresh token
const refreshToken = createAsyncThunk<loginResponse, void, { rejectValue: string }>(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
     const { data} =  await api.post("/auth/refresh");
      setAccessToken(data.token);
      return data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
)
// upload image profile
const uploadImage = createAsyncThunk<string, File, { rejectValue: string }>(
  "user/uploadImage",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post("/users/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data.imageUrl;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
)

// update user profile
const updateUserProfile = createAsyncThunk<
  userType,
 userType,
  { rejectValue: string }
>("user/updateUserProfile", async (user, { rejectWithValue }) => {
  try {
    const { data } = await api.put("/auth/profile", user);
    return data.user;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
})

// logout user
const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.get("/auth/logout");
      clearAccessToken();
      return;
    } catch (error: unknown) {
      rejectWithValue(getErrorMessage(error));
    }
  },
);

export { fetchCurrentUser, loginUser, registerUser, refreshToken, logoutUser,uploadImage,updateUserProfile };
