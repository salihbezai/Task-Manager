import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { toast } from "react-toastify";



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

// download tasks as CSV
const downloadTasksCSV = createAsyncThunk(
    'task/downloadTasksCSV',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/reports/export/tasks', {
                responseType: 'blob',
            });
            
      // Create download link
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
    
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'tasks_report.xlsx';
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export {getDashboardData,fetchAllTasks, 
    createTask,fetchTaskById, updateTask,deleteTask, downloadTasksCSV };