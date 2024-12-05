import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import { apiSlice } from '@/app/api/apiSlice';

interface SearchState {
  query: string;
  results: any[]; 
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SearchState = {
  query: '',
  results: [],
  status: 'idle',
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload || '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(apiSlice.endpoints.search.matchPending, (state) => {
        state.status = 'loading';
      })
      .addMatcher(apiSlice.endpoints.search.matchFulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload;
      })
      .addMatcher(apiSlice.endpoints.search.matchRejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const { setQuery } = searchSlice.actions;
export default searchSlice.reducer;
