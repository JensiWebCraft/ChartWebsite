import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUsersAPI, createUserAPI } from "../api/userApi";


export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const res = await getUsersAPI();
  return res.data;
});

export const addUser = createAsyncThunk("users/addUser", async (user) => {
  const res = await createUserAPI(user);
  return res.data;
});

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
    
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      });
  },
});

export default userSlice.reducer;
