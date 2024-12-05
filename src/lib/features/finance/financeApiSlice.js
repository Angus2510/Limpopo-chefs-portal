import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

const feesAdapter = createEntityAdapter({});

const initialState = feesAdapter.getInitialState();

export const feesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudentFees: builder.query({
      query: (params) => ({
        url: `/finance/studentFees?campus=${params.campus}&intakeGroup=${params.intakeGroup}`,
        method: 'GET',
      }),
      transformResponse: (responseData) => {
        const loadedFees = responseData.map((fee) => {
          return { ...fee, id: fee.studentNumber };
        });
        return feesAdapter.setAll(initialState, loadedFees);
      },
      providesTags: (result, error, arg) => [
        { type: 'StudentFee', id: 'LIST' },
        ...(result?.ids || []).map((id) => ({ type: 'StudentFee', id })),
      ],
    }),

    getStudentFeesById: builder.query({
      query: (studentId) => ({
        url: `/finance/studentFees/${studentId}`,
        method: 'GET',
      }),
      transformResponse: (responseData) => ({
        id: responseData.studentNumber,
        amount: responseData.payableFees.map(fee => fee.amount),
        dueDate: responseData.payableFees.map(fee => fee.dueDate)
      }),
      providesTags: (result, error, arg) => [
        { type: 'StudentFee', id: arg },
      ],
    }),

    bulkAddPayableFees: builder.mutation({
      query: (newFees) => ({
        url: '/finance/studentFees/add',
        method: 'POST',
        body: newFees,
      }),
      invalidatesTags: [{ type: 'StudentFee', id: 'LIST' }],
    }),
  }),
});

export const { useGetStudentFeesQuery, useGetStudentFeesByIdQuery, useBulkAddPayableFeesMutation } = feesApiSlice;


export const selectStudentFeesResult = feesApiSlice.endpoints.getStudentFees.select();


const selectStudentFeesData = createSelector(
  selectStudentFeesResult,
  (studentFeesResult) => studentFeesResult.data 
);


export const {
  selectAll: selectAllStudentFees,
  selectById: selectStudentFeeById,
  selectIds: selectStudentFeesIds,
} = feesAdapter.getSelectors(
  (state) => selectStudentFeesData(state) ?? initialState
);
