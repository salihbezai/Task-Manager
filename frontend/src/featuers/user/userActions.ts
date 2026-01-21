import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";


 const fetchUsers = createAsyncThunk(
    'user/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/users');
            return data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

const downloadUsersCSV = createAsyncThunk(
    'user/downloadUsersCSV',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/reports/export/users', {
                responseType: 'blob',
            });
      // Create download link
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
    
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'users_report.xlsx';
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





export { fetchUsers, downloadUsersCSV };