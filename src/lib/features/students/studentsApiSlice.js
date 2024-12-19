import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/app/api/apiSlice";

const studentsAdapter = createEntityAdapter({});

const initialState = studentsAdapter.getInitialState();

export const studentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => "/students",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedStudents = responseData.map((student) => {
          student.id = student._id;
          return student;
        });
        return studentsAdapter.setAll(initialState, loadedStudents);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Student", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Student", id })),
          ];
        } else return [{ type: "Student", id: "LIST" }];
      },
    }),

    getStudentById: builder.query({
      query: (id) => `/students/${id}`,
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData, meta, arg) => {
        // Assuming responseData is an array and you need the first item
        const student = Array.isArray(responseData)
          ? responseData[0]
          : responseData;
        return studentsAdapter.upsertOne(initialState, {
          ...student,
          id: student._id,
        });
      },
      providesTags: (result, error, id) => [{ type: "Student", id }],
    }),

    addNewStudent: builder.mutation({
      query: (formData) => ({
        url: "/students",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Student", id: "LIST" }],
    }),

    updateStudent: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/students/${id}`,
        method: "PATCH",
        body: formData,
        headers: {},
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Student", id: arg.id },
      ],
    }),

    toggleStudentStatus: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/students/toggle-status/${id}`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Student", id: arg.id },
      ],
    }),

    deleteStudent: builder.mutation({
      query: ({ id }) => ({
        url: `/students`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Student", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useAddNewStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useToggleStudentStatusMutation,
} = studentsApiSlice;

// returns the query result object
export const selectStudentsResult =
  studentsApiSlice.endpoints.getStudents.select();

// creates memoized selector
const selectStudentsData = createSelector(
  selectStudentsResult,
  (studentsResult) => studentsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllStudents,
  selectById: selectStudentById,
  selectIds: selectStudentsIds,
  // Pass in a selector that returns the users slice of state
} = studentsAdapter.getSelectors(
  (state) => selectStudentsData(state) ?? initialState
);
