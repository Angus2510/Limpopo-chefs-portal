import { apiSlice } from '@/app/api/apiSlice';
import { createEntityAdapter } from '@reduxjs/toolkit';

const assignmentsAdapter = createEntityAdapter();

const initialState = assignmentsAdapter.getInitialState();

export const guardianApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGuardianDashboard: builder.query({
      query: (guardianId) => `/guardian-profile/dashboard/${guardianId}`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        return responseData.map(event => ({
          ...event,
          id: event._id,
          start: event.startDate,
          end: event.endDate,
        }));
      },
      providesTags: (result, error, arg) => {
        if (result) {
          return [
            { type: 'GuardianEvent', id: 'LIST' },
            ...result.map(({ id }) => ({ type: 'GuardianEvent', id })),
          ];
        } else return [{ type: 'GuardianEvent', id: 'LIST' }];
      },
    }),

    getGuardianAttendance: builder.query({
      query: ({ guardianId, month, year }) => ({
        url: `/guardian-profile/attendance/${guardianId}`,
        method: 'GET',
        params: { month, year }
      }),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        return responseData.data.map(record => ({
          ...record,
          id: `${record.date}-${record.status.map(s => s.studentId).join('-')}`,
        }));
      },
      providesTags: (result, error, arg) => [
        { type: 'Attendance', id: 'GUARDIAN_ATTENDANCE' },
        ...(result || []).map((record) => ({ type: 'Attendance', id: record.id })),
      ],
    }),

    getGuardianAssignmentResults: builder.query({
      query: (guardianId) => `/guardian-profile/assignment-results/${guardianId}`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        console.log('Transforming response data:', responseData);
        const loadedResults = responseData.map((result) => {
          result.id = result._id;
          return result;
        });
        console.log('Loaded Results:', loadedResults);
        const normalizedResults = assignmentsAdapter.setAll(initialState, loadedResults);
        console.log('Normalized Results:', normalizedResults);
        return normalizedResults;
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'AssignmentResult', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'AssignmentResult', id })),
          ];
        } else return [{ type: 'AssignmentResult', id: 'LIST' }];
      },
    }),

    getGuardianCollectedFees: builder.query({
      query: (guardianId) => ({
        url: `/guardian-profile/fees/${guardianId}`,
        method: 'GET',
      }),
      transformResponse: (responseData) => {
        return responseData.map((fee, index) => ({
          ...fee,
          id: fee._id || index,
          transactionDate: fee.transactionDate.split('T')[0],
        }));
      },
      providesTags: (result, error, arg) => [
        { type: 'CollectedFee', id: arg },
        ...(result || []).map((fee) => ({ type: 'CollectedFee', id: fee.id })),
      ],
    }),

    
  }),
});

export const {
  useGetGuardianDashboardQuery,
  useGetGuardianAttendanceQuery,
  useGetGuardianAssignmentResultsQuery,
  useGetGuardianCollectedFeesQuery,
 } = guardianApiSlice;
