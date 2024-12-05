import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

const resultsAdapter = createEntityAdapter({});

const initialState = resultsAdapter.getInitialState({
  outcomeType: '', // Add initial state for outcomeType
});

export const resultsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getResults: builder.query({
      query: (params) => ({
        url: `/results?campus=${params.campus}&intakeGroup=${params.intakeGroup}&outcome=${params.outcome}`,
        method: 'GET',
      }),
      transformResponse: (responseData) => {
        const loadedResults = responseData.students.map((result) => {
          return { ...result, id: result.studentNumber };
        });
        // Return the state including the outcomeType
        return {
          ...resultsAdapter.setAll(initialState, loadedResults),
          outcomeType: responseData.outcomeType,
        };
      },
      providesTags: (result, error, arg) => [
        { type: 'Result', id: 'LIST' },
        ...(result?.ids || []).map((id) => ({ type: 'Result', id })),
      ],
    }),

    getStudentResultsById: builder.query({
      query: (studentId) => ({
        url: `/results/${studentId}`,
        method: 'GET',
      }),
      transformResponse: (responseData) => {
        return responseData;
      },
      providesTags: (result, error, arg) => [{ type: 'Result', id: arg }],
    }),

    updateResults: builder.mutation({
      query: (payload) => ({
        url: '/results',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Result', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetResultsQuery,
  useGetStudentResultsByIdQuery,
  useUpdateResultsMutation,
} = resultsApiSlice;

// Returns the query result object
export const selectResultsResult =
  resultsApiSlice.endpoints.getResults.select();

// Creates memoized selector
const selectResultsData = createSelector(
  selectResultsResult,
  (resultsResult) => resultsResult.data // normalized state object with ids & entities
);

// Get selectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllResults,
  selectById: selectResultById,
  selectIds: selectResultsIds,
} = resultsAdapter.getSelectors(
  (state) => selectResultsData(state) ?? initialState
);

// Selector to get the outcomeType
export const selectOutcomeType = createSelector(
  selectResultsResult,
  (resultsResult) => resultsResult.data?.outcomeType || ''
);
