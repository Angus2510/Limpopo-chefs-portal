import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

const reportsAdapter = createEntityAdapter({
  selectId: (report) => report.admissionNumber, // Use a unique field as the ID
});

const initialState = reportsAdapter.getInitialState();

export const reportsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAccountsInArrears: builder.query({
      query: () => '/reports/accounts-in-arrears',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedReports = responseData.map((report) => {
          report.id = report.admissionNumber; // Ensure each report has a unique ID
          return report;
        });
        return reportsAdapter.setAll(initialState, loadedReports);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Report', id: 'AccountsInArrears' },
            ...result.ids.map((id) => ({ type: 'Report', id })),
          ];
        } else return [{ type: 'Report', id: 'AccountsInArrears' }];
      },
    }),

    getModerationReport: builder.query({
      query: () => '/reports/moderation-report',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedReports = responseData.map((report) => {
          report.id = report.admissionNumber; // Ensure each report has a unique ID
          return report;
        });
        return reportsAdapter.setAll(initialState, loadedReports);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Report', id: 'ModerationReport' },
            ...result.ids.map((id) => ({ type: 'Report', id })),
          ];
        } else return [{ type: 'Report', id: 'ModerationReport' }];
      },
    }),
  }),
});

export const {
  useGetAccountsInArrearsQuery,
  useGetModerationReportQuery,
} = reportsApiSlice;

// Returns the query result object
export const selectReportsResult =
  reportsApiSlice.endpoints.getAccountsInArrears.select();

// Creates memoized selector
const selectReportsData = createSelector(
  selectReportsResult,
  (reportsResult) => reportsResult.data // Normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllReports,
  selectById: selectReportById,
  selectIds: selectReportsIds,
} = reportsAdapter.getSelectors(
  (state) => selectReportsData(state) ?? initialState
);
