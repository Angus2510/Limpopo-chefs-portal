import { createEntityAdapter, createSlice, createSelector } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

const assignmentsAdapter = createEntityAdapter({});
const initialState = assignmentsAdapter.getInitialState();

export const studentAssignmentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudentAssignments: builder.query({
      query: (studentId) => `/assignments/student/${studentId}/assignments`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedAssignments = responseData.map((assignment) => {
          assignment.id = assignment._id;
          return assignment;
        });
        return assignmentsAdapter.setAll(initialState, loadedAssignments);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'StudentAssignment', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'StudentAssignment', id })),
          ];
        } else return [{ type: 'StudentAssignment', id: 'LIST' }];
      },
    }),

    getStudentAssignmentResults: builder.query({
      query: (studentId) => `/assignments/student/results/${studentId}`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedResults = responseData.map((result) => {
          result.id = result._id;
          return result;
        });
        return assignmentsAdapter.setAll(initialState, loadedResults);
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

    startAssignment: builder.mutation({
      query: ({ assignmentId, studentId, password }) => ({
        url: `/assignments/student/${studentId}/assignments/${assignmentId}/start`,
        method: 'POST',
        body: { password },
      }),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
    }),

    startWritingAssignment: builder.mutation({
      query: ({ assignmentId, studentId }) => ({
        url: `/assignments/student/${studentId}/assignments/${assignmentId}/start-writing`,
        method: 'POST',
      }),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
    }),

    submitAnswer: builder.mutation({
      query: ({ assignmentId, studentId, questionId, answer, matchAnswers }) => ({
        url: `/assignments/student/${studentId}/assignments/${assignmentId}/answers`,
        method: 'POST',
        body: { questionId, answer, matchAnswers },
      }),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
    }),

    submitAssignment: builder.mutation({
      query: ({ assignmentId, studentId, answers }) => ({
        url: `/assignments/student/${studentId}/assignments/${assignmentId}/assignment`,
        method: 'POST',
        body: { answers },
      }),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
    }),

    terminateAssignment: builder.mutation({
      query: ({ assignmentId, studentId, answers }) => ({
        url: `/assignments/student/${studentId}/assignments/${assignmentId}/assignment/terminate`,
        method: 'POST',
        body: { answers },
      }),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
    }),
  }),
});

export const {
  useGetStudentAssignmentsQuery,
  useStartAssignmentMutation,
  useGetStudentAssignmentResultsQuery,
  useSubmitAnswerMutation,
  useStartWritingAssignmentMutation,
  useSubmitAssignmentMutation,
  useTerminateAssignmentMutation,
} = studentAssignmentsApiSlice;

// returns the query result object
export const selectStudentAssignmentsResult = studentAssignmentsApiSlice.endpoints.getStudentAssignments.select();

export const selectStudentAssignmentResultsResult = studentAssignmentsApiSlice.endpoints.getStudentAssignmentResults.select();

// creates memoized selector
const selectStudentAssignmentsData = createSelector(
  selectStudentAssignmentsResult,
  (assignmentsResult) => assignmentsResult.data 
);

const selectStudentAssignmentResultsData = createSelector(
  selectStudentAssignmentResultsResult,
  (results) => results.data 
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllStudentAssignments,
  selectById: selectStudentAssignmentById,
  selectIds: selectStudentAssignmentsIds,
} = assignmentsAdapter.getSelectors(
  (state) => selectStudentAssignmentsData(state) ?? initialState
);

export const {
  selectAll: selectAllStudentAssignmentResults,
  selectById: selectStudentAssignmentResultById,
  selectIds: selectStudentAssignmentResultsIds,
} = assignmentsAdapter.getSelectors(
  (state) => selectStudentAssignmentResultsData(state) ?? initialState
);
