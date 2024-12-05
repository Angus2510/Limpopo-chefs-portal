import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

// Creating an API slice for WEL attendance
export const welAttendanceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addWelAttendance: builder.mutation({
      query: (formData) => ({
        url: '/attendance/wel',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['WelAttendance'],
    }),

    getAllWelAttendance: builder.query({
        query: () => '/attendance/wel',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
        transformResponse: (responseData) => {
          return responseData.map((welAttendance) => {
            welAttendance.id = welAttendance._id;
            return welAttendance;
          });
        },
        providesTags: (result, error, arg) => 
          result ? [
            ...result.map(({ id }) => ({ type: 'WelAttendance', id })),
            { type: 'WelAttendance', id: 'LIST' },
          ] : [{ type: 'WelAttendance', id: 'LIST' }],
      }),
  }),
});

export const { useAddWelAttendanceMutation , useGetAllWelAttendanceQuery } = welAttendanceApiSlice;
