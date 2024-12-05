import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

const collectedFeesAdapter = createEntityAdapter({});

const initialState = collectedFeesAdapter.getInitialState();

export const collectFeesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    collectFees: builder.mutation({
      query: ({ studentId, collectedFee }) => ({
        url: '/finance/collectFees',
        method: 'POST',
        body: { studentId, collectedFee },
      }),
      invalidatesTags: [{ type: 'CollectedFee', id: 'LIST' }],
    }),
    getCollectedFeesByStudentId: builder.query({
      query: (studentId) => ({
        url: `/finance/collectfees/${studentId}`,
        method: 'GET',
      }),
      transformResponse: (responseData) => {
        return responseData.map((fee, index) => ({ ...fee, id: fee._id || index })); // Use _id if available, otherwise index
      },
      providesTags: (result, error, arg) => [
        { type: 'CollectedFee', id: arg },
        ...(result || []).map((fee) => ({ type: 'CollectedFee', id: fee.id })),
      ],
    }),
    updateCollectedFees: builder.mutation({
      query: ({ studentId, collectedFees }) => ({
        url: '/finance/updatecollectfees',
        method: 'POST',
        body: { studentId, collectedFees },
      }),
      invalidatesTags: (result, error, { studentId }) => [
        { type: 'CollectedFee', id: studentId },
      ],
    }),
  }),
});

export const { useCollectFeesMutation, useGetCollectedFeesByStudentIdQuery, useUpdateCollectedFeesMutation } = collectFeesApiSlice;

// Returns the query result object
export const selectCollectedFeesResult = collectFeesApiSlice.endpoints.getCollectedFeesByStudentId.select();

// Creates memoized selector
const selectCollectedFeesData = createSelector(
  selectCollectedFeesResult,
  (collectedFeesResult) => collectedFeesResult.data // array of collected fees
);

// Get selectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllCollectedFees,
  selectById: selectCollectedFeeById,
  selectIds: selectCollectedFeesIds,
} = collectedFeesAdapter.getSelectors(
  (state) => selectCollectedFeesData(state) ?? initialState
);

export const selectCollectedFeesByStudentId = (state, studentId) =>
  (selectCollectedFeesData(state) || []).filter(fee => fee.studentId === studentId);
