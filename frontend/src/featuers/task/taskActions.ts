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
            return data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

// create task
const createTask = createAsyncThunk(
    'task/createTask',
    async (task: any, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/tasks/create', task);
            return data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

const fetchTaskById = createAsyncThunk(
    'task/fetchTaskById',
    async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/tasks/${id}`);
            return data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

// update task
const updateTask = createAsyncThunk(    
    'task/updateTask',
    async (task: any, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/tasks/update/${task._id}`, task);
            return data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }   
    }
)

// delete task 
const deleteTask = createAsyncThunk(
    'task/deleteTask',
    async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/tasks/delete/${id}`);
            return data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)


export {getDashboardData,fetchAllTasks, createTask,fetchTaskById, updateTask,deleteTask}