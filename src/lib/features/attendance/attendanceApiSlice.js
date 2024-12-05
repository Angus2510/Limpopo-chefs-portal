import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

const attendanceAdapter = createEntityAdapter({
  selectId: (attendance) => `${attendance.date}-${attendance.student}`,
});

const initialState = attendanceAdapter.getInitialState();

export const attendanceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttendance: builder.query({
      query: (params) => ({
        url: `/attendance/student?campusId=${params.campus}&intakeGroupId=${params.intakeGroup}&date=${params.date}`,
        method: 'GET',
      }),
      transformResponse: (responseData) => {
        const loadedAttendance = Object.entries(responseData).flatMap(([date, students]) =>
          students.map(student => ({
            ...student,
            date,
            id: `${date}-${student.student}`,
          }))
        );
        console.log('Transformed Attendance:', loadedAttendance);
        return attendanceAdapter.setAll(initialState, loadedAttendance);
      },
      providesTags: (result, error, arg) => [
        { type: 'Attendance', id: 'LIST' },
        ...(result?.ids || []).map((id) => ({ type: 'Attendance', id })),
      ],
    }),

    getAttendanceByMonth: builder.query({
      query: (params) => ({
        url: `/attendance/student/${params.studentId}/${params.year}/${params.month}`,
        method: 'GET',
      }),
      transformResponse: (responseData, meta, arg) => {
        // 'arg' contains the parameters passed to the query
        const { studentId } = arg;
        // Assuming the responseData.data contains an array of attendance records
        const loadedAttendance = responseData.data.map(record => ({
          ...record,
          id: `${record.date}-${studentId}`,
        }));
        console.log('Transformed Monthly Attendance:', loadedAttendance);
        return attendanceAdapter.setAll(initialState, loadedAttendance);
      },
      providesTags: (result, error, arg) => [
        { type: 'Attendance', id: 'MONTHLY_LIST' },
        ...(result?.ids || []).map((id) => ({ type: 'Attendance', id })),
      ],
    }),

    addAttendance: builder.mutation({
      query: (newAttendance) => ({
        url: '/attendance/student',
        method: 'POST',
        body: newAttendance,
      }),
      invalidatesTags: [{ type: 'Attendance', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAttendanceQuery,
  useAddAttendanceMutation,
  useGetAttendanceByMonthQuery,
} = attendanceApiSlice;

export const selectAttendanceResult = attendanceApiSlice.endpoints.getAttendance.select();

const selectAttendanceData = createSelector(
  selectAttendanceResult,
  (attendanceResult) => attendanceResult.data
);

export const {
  selectAll: selectAllAttendance,
  selectById: selectAttendanceById,
  selectIds: selectAttendanceIds,
} = attendanceAdapter.getSelectors(
  (state) => selectAttendanceData(state) ?? initialState
);
