import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await api.post('/login/', credentials);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    await api.post('/register/', userData);
    return;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await api.post('/logout/');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuthenticated: false, isAdmin: false, user: null, loading: false, error: null },
  reducers: {
    resetError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isAdmin = action.payload.is_admin;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Ошибка входа';
      })
      .addCase(registerUser.pending, (state) => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false; })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.isAdmin = false;
      });
  }
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;