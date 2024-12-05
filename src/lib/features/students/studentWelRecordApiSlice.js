import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

const welRecordsAdapter = createEntityAdapter({});

const initialState = welRecordsAdapter.getInitialState();

export const studentsWelRecordApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addWelRecord: builder.mutation({
      query: ({ studentId, welRecords }) => ({
        url: 'students/wel-records',
        method: 'POST',
        body: { studentId, welRecords },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'WelRecord', id: arg.studentId },
      ],
    }),
    getWelRecordsByStudentId: builder.query({
      query: (studentId) => ({
        url: `students/wel-records/student/${studentId}`,
        method: 'GET',
      }),
      transformResponse: (responseData) => {
        return responseData.map((record, index) => ({ ...record, id: record._id || index })); // Use _id if available, otherwise index
      },
      providesTags: (result, error, arg) => [
        { type: 'WelRecord', id: arg },
        ...(result || []).map((record) => ({ type: 'WelRecord', id: record.id })),
      ],
    }),
  }),
});

export const {
  useAddWelRecordMutation,
  useGetWelRecordsByStudentIdQuery,
} = studentsWelRecordApiSlice;

// Returns the query result object
export const selectWelRecordsResult = studentsWelRecordApiSlice.endpoints.getWelRecordsByStudentId.select();

// Creates memoized selector
const selectWelRecordsData = createSelector(
  selectWelRecordsResult,
  (welRecordsResult) => welRecordsResult.data // array of wel records
);

// Get selectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllWelRecords,
  selectById: selectWelRecordById,
  selectIds: selectWelRecordIds,
} = welRecordsAdapter.getSelectors(
  (state) => selectWelRecordsData(state) ?? initialState
);

export const selectWelRecordsByStudentId = (state, studentId) =>
  (selectWelRecordsData(state) || []).filter(record => record.studentId === studentId);
