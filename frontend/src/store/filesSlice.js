import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchFiles = createAsyncThunk('files/fetch', async (userId, thunkAPI) => {
  const params = userId ? { user_id: userId } : {};
  const response = await api.get('/files/', { params });
  return response.data;
});

export const uploadFile = createAsyncThunk('files/upload', async ({ file, comment, userId }, thunkAPI) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('comment', comment);
  if (userId) formData.append('user_id', userId);
  const response = await api.post('/files/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return response.data;
});

export const deleteFile = createAsyncThunk('files/delete', async (fileId) => {
  await api.delete(`/files/${fileId}/delete_file/`);
  return fileId;
});

export const renameFile = createAsyncThunk('files/rename', async ({ fileId, newName }) => {
  const response = await api.patch(`/files/${fileId}/`, { original_name: newName }); // ИСПРАВЛЕНО
  return response.data;
});

export const updateComment = createAsyncThunk('files/updateComment', async ({ fileId, comment }) => {
  const response = await api.patch(`/files/${fileId}/update_comment/`, { comment });
  return response.data;
});

// остальные actions (скачивание, получение ссылки) реализованы в компонентах

const filesSlice = createSlice({
  name: 'files',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => { state.loading = true; })
      .addCase(fetchFiles.fulfilled, (state, action) => { state.items = action.payload; state.loading = false; })
      .addCase(fetchFiles.rejected, (state, action) => { state.error = action.error.message; state.loading = false; })
      .addCase(uploadFile.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(deleteFile.fulfilled, (state, action) => { state.items = state.items.filter(f => f.id !== action.payload); })
      .addCase(renameFile.fulfilled, (state, action) => {
        const idx = state.items.findIndex(f => f.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const idx = state.items.findIndex(f => f.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  }
});

export default filesSlice.reducer;