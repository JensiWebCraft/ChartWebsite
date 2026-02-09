import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "https://6979b05acc9c576a8e175b9a.mockapi.io/tasks";

export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async (_, { getState, rejectWithValue }) => {
    const { tasks } = getState().tasks;

    if (tasks.length > 0) return tasks;

    try {
      const res = await axios.get(API);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch tasks",
      );
    }
  },
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (task, { rejectWithValue }) => {
    try {
      const res = await axios.post(API, task);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to create task");
    }
  },
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API}/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to update task");
    }
  },
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue("Failed to delete task");
    }
  },
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

     
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })

      .addCase(updateTask.pending, (state, action) => {
        const { id, data } = action.meta.arg;
        const task = state.tasks.find((t) => String(t.id) === String(id));
        if (task) Object.assign(task, data);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (t) => String(t.id) === String(action.payload.id),
        );
        if (index !== -1) state.tasks[index] = action.payload;
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (t) => String(t.id) !== String(action.payload),
        );
      });
  },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer;
