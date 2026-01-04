import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";


 const fetchUsers = createAsyncThunk(
    'user/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/users');
            console.log("the users are "+JSON.stringify(data))
            return data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)






export { fetchUsers };