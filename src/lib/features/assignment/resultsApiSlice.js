import { apiSlice } from '@/app/api/apiSlice';

export const assignmentResultsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAssignmentResults: builder.query({
      query: ({ assignmentId }) =>
        `/assignments/${assignmentId}/results`,
    }),
    getAssignmentResultById: builder.query({
      query: ({ assignmentId, resultId }) =>
        `/assignments/${assignmentId}/results/${resultId}`,
    }),
    createAssignmentResult: builder.mutation({
      query: ({ assignmentId, result }) => ({
        url: `/assignments/${assignmentId}/results`,
        method: 'POST',
        body: result,
      }),
    }),
    updateAssignmentResult: builder.mutation({
      query: ({ assignmentId, resultId, ...patch }) => ({
        url: `/assignments/${assignmentId}/results/${resultId}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
    deleteAssignmentResult: builder.mutation({
      query: ({ assignmentId, resultId }) => ({
        url: `/assignments/${assignmentId}/results/${resultId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAllAssignmentResultsQuery,
  useGetAssignmentResultByIdQuery,
  useCreateAssignmentResultMutation,
  useUpdateAssignmentResultMutation,
  useDeleteAssignmentResultMutation,
} = assignmentResultsApiSlice;
