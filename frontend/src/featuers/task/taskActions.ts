import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";



const getDashboardData = createAsyncThunk(
    'task/fetchDashboardData',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/tasks/dashboard-data');
            return data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

// get all tasks
const fetchAllTasks = createAsyncThunk(
    'task/fetchAllTasks',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/tasks');
            console.log("tasks "+JSON.stringify(data))
            return data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)


export {getDashboardData,fetchAllTasks}