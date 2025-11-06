import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { artistsAPI } from '../../services/api';

export const fetchArtists = createAsyncThunk(
  'artists/fetchArtists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await artistsAPI.getAll();
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch artists');
    }
  }
);

const artistsSlice = createSlice({
  name: 'artists',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default artistsSlice.reducer;
