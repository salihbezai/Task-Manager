import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/axios";



const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/auth/me');
            return data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/login', credentials);
            return data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export { fetchCurrentUser, loginUser };