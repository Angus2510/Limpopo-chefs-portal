import { createEntityAdapter, createSlice, createSelector } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

const resultsAdapter = createEntityAdapter({});
const initialState = resultsAdapter.getInitialState();

export const resultsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getResults: builder.query({
      query: () => '/assignments/staff/results',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedResults = responseData.map((result) => {
          result.id = result._id;
          return result;
        });
        return resultsAdapter.setAll(initialState, loadedResults);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Result', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Result', id })),
          ];
        } else return [{ type: 'Result', id: 'LIST' }];
      },
    }),
    getResultById: builder.query({
      query: (id) => `/assignments/staff/results/${id}`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        return { ...responseData, id: responseData._id };
      },
      providesTags: (result, error, id) => [{ type: 'Result', id }],
    }),

    getResultsByStudentId: builder.query({
      query: (studentId) => `/assignments/staff/results/student/${studentId}`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedResults = responseData.map((result) => {
          result.id = result._id;
          return result;
        });
        return resultsAdapter.setAll(initialState, loadedResults);
      },
      providesTags: (result, error, studentId) => [{ type: 'Result', id: studentId }],
    }),

    addCommentToResult: builder.mutation({
      query: ({ id, comment }) => ({
        url: `/assignments/staff/results/${id}/comments`,
        method: 'POST',
        body: { comment },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Result', id }],
    }),

    updateResultById: builder.mutation({
      query: ({ id, data }) => ({
        url: `/assignments/staff/results/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Result', id }],
    }),

    updateModeratedMarksById: builder.mutation({
      query: ({ id, data }) => ({
        url: `/assignments/staff/results/${id}/moderated-marks`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Result', id }],
    }),

    getModerationsByResultId: builder.query({
      query: (id) => `/assignments/staff/results/${id}/moderated-marks`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        return responseData.map((moderation) => ({
          ...moderation,
          id: moderation._id,
        }));
      },
      providesTags: (result, error, id) => [{ type: 'Moderation', id }],
    }),

  }),
});

export const {
  useGetResultsQuery,
  useGetResultByIdQuery,
  useAddCommentToResultMutation,
  useUpdateResultByIdMutation,
  useUpdateModeratedMarksByIdMutation,
  useGetResultsByStudentIdQuery,
  useGetModerationsByResultIdQuery,
} = resultsApiSlice;

export const selectResultsResult =
  resultsApiSlice.endpoints.getResults.select();

const selectResultsData = createSelector(
  selectResultsResult,
  (resultsResult) => resultsResult.data
);

export const selectResultsByStudentId = createSelector(
  selectResultsData,
  (results) => results
);

export const {
  selectAll: selectAllResults,
  selectById: selectResultById,
  selectIds: selectResultIds,
} = resultsAdapter.getSelectors(
  (state) => selectResultsData(state) ?? initialState
);
