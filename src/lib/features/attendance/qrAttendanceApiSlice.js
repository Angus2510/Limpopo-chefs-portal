import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

// Creating an entity adapter to manage normalized data
const qrAttendanceAdapter = createEntityAdapter({});

// Initial state using the adapter
const initialState = qrAttendanceAdapter.getInitialState();

// Creating the API slice
export const qrAttendanceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQrAttendance: builder.query({
      query: () => '/attendance/qr',
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        const loadedQrAttendance = responseData.map((qrAttendance) => {
          qrAttendance.id = qrAttendance._id;
          return qrAttendance;
        });
        return qrAttendanceAdapter.setAll(initialState, loadedQrAttendance);
      },
      providesTags: (result, error, arg) => [
        { type: 'QrAttendance', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'QrAttendance', id })),
      ],
    }),

    getQrById: builder.query({
      query: (id) => `/attendance/qr/${id}`,
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        responseData.id = responseData._id;
        return responseData;
      },
      providesTags: (result, error, id) => [{ type: 'QrAttendance', id }],
    }),

    addNewQrAttendance: builder.mutation({
      query: (formData) => ({
        url: '/attendance/qr',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'QrAttendance', id: 'LIST' }],
    }),

    deleteQrAttendance: builder.mutation({
      query: ({ id }) => ({
        url: `/attendance/qr/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'QrAttendance', id: arg.id },
      ],
    }),
    
  }),
});

export const {
  useGetQrAttendanceQuery,
  useGetQrByIdQuery,
  useAddNewQrAttendanceMutation,
  useDeleteQrAttendanceMutation,
} = qrAttendanceApiSlice;

// Selecting the query result object
export const selectQrAttendanceResult =
  qrAttendanceApiSlice.endpoints.getQrAttendance.select();

// Creating a memoized selector to access the data
const selectQrAttendanceData = createSelector(
  selectQrAttendanceResult,
  (qrAttendanceResult) => qrAttendanceResult.data // normalized state object with ids & entities
);

// Get selectors for easy access to normalized data
export const {
  selectAll: selectAllQrAttendances,
  selectById: selectQrAttendanceById,
  selectIds: selectQrAttendanceIds,
} = qrAttendanceAdapter.getSelectors(
  (state) => selectQrAttendanceData(state) ?? initialState
);
