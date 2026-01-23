import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { User } from "./userTypes";
import { getErrorMessage } from "../../utils/errorHelper";

const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/users");
      return data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const downloadUsersCSV = createAsyncThunk<boolean, void, { rejectValue: string }>(
  "user/downloadUsersCSV",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/reports/export/users", {
        responseType: "blob",
      });
      // Create download link
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "users_report.xlsx";
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

export { fetchUsers, downloadUsersCSV };
