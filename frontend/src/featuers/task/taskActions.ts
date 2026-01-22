import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { getErrorMessage } from "../../utils/errorHelper";
import type { CreateTaskPayload, Task } from "./taskTypes";


export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
}
const getDashboardData = createAsyncThunk<DashboardStats, void, { rejectValue: string }>(
  "task/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/tasks/dashboard-data");
      return data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// get all tasks
const fetchAllTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  "task/fetchAllTasks",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/tasks");
      return data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// create task
const createTask = createAsyncThunk<Task, CreateTaskPayload, { rejectValue: string }>(
  "task/createTask",
  async (task: CreateTaskPayload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/tasks/create", task);
      console.log("the tasks added is "+JSON.stringify(data))
      return data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const fetchTaskById = createAsyncThunk<Task, string, { rejectValue: string }>(
  "task/fetchTaskById",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/tasks/${id}`);
      return data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// update task
const updateTask = createAsyncThunk<Task, Task, { rejectValue: string }>(
  "task/updateTask",
  async (task: Task, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/tasks/update/${task._id}`, task);
      return data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// delete task
const deleteTask = createAsyncThunk<string, string, { rejectValue: string }>(
  "task/deleteTask",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/tasks/delete/${id}`);
      return data.id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// download tasks as CSV
const downloadTasksCSV = createAsyncThunk<boolean, void, { rejectValue: string }>(
  "task/downloadTasksCSV",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/reports/export/tasks", {
        responseType: "blob",
      });

      // Create download link
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "tasks_report.xlsx";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export {
  getDashboardData,
  fetchAllTasks,
  createTask,
  fetchTaskById,
  updateTask,
  deleteTask,
  downloadTasksCSV,
};
