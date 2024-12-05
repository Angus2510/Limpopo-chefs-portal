import { createEntityAdapter, createSlice, createSelector } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

const assignmentsAdapter = createEntityAdapter({});
const initialState = assignmentsAdapter.getInitialState();

export const assignmentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignments: builder.query({
      query: () => '/assignments',
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
            { type: 'Assignment', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Assignment', id })),
          ];
        } else return [{ type: 'Assignment', id: 'LIST' }];
      },
    }),

    getAssignmentById: builder.query({
      query: (id) => `assignments/${id}`,
      transformResponse: (responseData) => ({
          ids: [responseData._id],
          entities: {
              [responseData._id]: {
                  ...responseData,
                  id: responseData._id,
              }
          }
      }),
      providesTags: (result, error, id) => [{ type: 'Assignment', id }],
   }),

    addAssignment: builder.mutation({
      query: (assignmentData) => ({
        url: '/assignments',
        method: 'POST',
        body: assignmentData,
      }),
      invalidatesTags: [{ type: 'Assignment', id: 'LIST' }],
    }),

    updateAssignment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/assignments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Assignment', id }],
    }),

    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `/assignments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Assignment', id }],
    }),

    uploadFile: builder.mutation({
      query: ({ assignmentId, questionId, formData }) => ({
        url: `/assignments/upload?assignmentId=${assignmentId}&questionId=${questionId}`,
        method: 'POST',
        body: formData,
      }),
    }),

    addQuestion: builder.mutation({
      query: ({ assignmentId, data }) => ({
        url: `/assignments/${assignmentId}/questions`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { assignmentId }) => [{ type: 'Assignment', id: assignmentId }],
    }),

    updateQuestion: builder.mutation({
      query: ({ assignmentId, id, data }) => ({
        url: `/assignments/${assignmentId}/questions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { assignmentId }) => [{ type: 'Assignment', id: assignmentId }],
    }),
  }),
});

export const {
  useGetAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useAddAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useUploadFileMutation,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
} = assignmentsApiSlice;

// returns the query result object
export const selectAssignmentsResult = assignmentsApiSlice.endpoints.getAssignments.select();

// creates memoized selector
const selectAssignmentsData = createSelector(
  selectAssignmentsResult,
  (assignmentsResult) => assignmentsResult.data
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllAssignments,
  selectById: selectAssignmentById,
  selectIds: selectAssignmentsIds,
} = assignmentsAdapter.getSelectors(
  (state) => selectAssignmentsData(state) ?? initialState
);
