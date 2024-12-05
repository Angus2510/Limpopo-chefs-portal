import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

const assignmentMarkAdapter = createEntityAdapter({});

const initialState = assignmentMarkAdapter.getInitialState();

export const assignmentMarkApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignmentResultsByIntakeGroup: builder.query({
      query: (intakeGroupId) => `/mark-assignment/${intakeGroupId}`,
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        // Ensure responseData is an array
        const formattedResponse = responseData.map((item) => ({
          id: item.campus._id,
          campus: item.campus,
          outcomes: item.outcomes,
        }));
        return assignmentMarkAdapter.setAll(initialState, formattedResponse);
      },
      providesTags: (result, error, arg) => [
        { type: 'AssignmentMark', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'AssignmentMark', id })),
      ],
    }),
    getAssignmentResultsByCampusAndOutcome: builder.query({
      query: ({ campusId, outcomeId }) => `/mark-assignment/campus/${campusId}/outcome/${outcomeId}`,
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        // Ensure responseData is an array
        const formattedResponse = responseData.map((item) => ({
          id: item._id,
          campus: item.campus,
          outcomes: item.assignment.outcome,
          assignmentTitle: item.assignment.title,
          assignmentId: item._id,
          lecturer: item.assignment.lecturer,
          student: item.student,
          status: item.status,
          scores: item.scores,
        }));
        return assignmentMarkAdapter.setAll(initialState, formattedResponse);
      },
      providesTags: (result, error, arg) => [
        { type: 'AssignmentMark', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'AssignmentMark', id })),
      ],
    }),

    getAllAssignmentResults: builder.query({
      query: () => `/mark-assignment`,
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        const formattedResponse = responseData.map((item) => ({
          id: item.campus._id,
          campus: item.campus,
          outcomes: item.outcomes,
        }));
        return assignmentMarkAdapter.setAll(initialState, formattedResponse);
      },
      providesTags: (result, error, arg) => [
        { type: 'AssignmentMark', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'AssignmentMark', id })),
      ],
    }),

  }),
});

export const {
  useGetAssignmentResultsByIntakeGroupQuery,
  useGetAssignmentResultsByCampusAndOutcomeQuery,
  useGetAllAssignmentResultsQuery,
} = assignmentMarkApiSlice;

// returns the query result object
export const selectAssignmentMarkResult =
  assignmentMarkApiSlice.endpoints.getAssignmentResultsByIntakeGroup.select();

// creates memoized selector
const selectAssignmentMarkData = createSelector(
  selectAssignmentMarkResult,
  (assignmentMarkResult) => assignmentMarkResult.data // normalized state object with ids & entities
);

// Get selectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllAssignmentMarks,
  selectById: selectAssignmentMarkById,
  selectIds: selectAssignmentMarkIds,
} = assignmentMarkAdapter.getSelectors(
  (state) => selectAssignmentMarkData(state) ?? initialState
);
