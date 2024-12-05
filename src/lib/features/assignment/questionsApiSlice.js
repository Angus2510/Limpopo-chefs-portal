import { apiSlice } from '@/app/api/apiSlice';

export const questionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionsForAssignment: builder.query({
      query: (assignmentId) => `/assignments/${assignmentId}/questions`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Question', id })),
              { type: 'Assignment', id: arg },
            ]
          : [{ type: 'Assignment', id: arg }],
    }),
    getQuestionById: builder.query({
      query: ({ assignmentId, questionId }) =>
        `/assignments/${assignmentId}/questions/${questionId}`,
      providesTags: (result, error, { questionId }) => [
        { type: 'Question', id: questionId },
      ],
    }),
    addQuestionToAssignment: builder.mutation({
      query: ({ assignmentId, question }) => ({
        url: `/assignments/${assignmentId}/questions`,
        method: 'POST',
        body: question,
      }),
      invalidatesTags: [{ type: 'Assignment', id: 'LIST' }],
    }),
    updateQuestion: builder.mutation({
      query: ({ assignmentId, questionId, ...patch }) => ({
        url: `/assignments/${assignmentId}/questions/${questionId}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { questionId }) => [
        { type: 'Question', id: questionId },
      ],
    }),
    deleteQuestion: builder.mutation({
      query: ({ assignmentId, questionId }) => ({
        url: `/assignments/${assignmentId}/questions/${questionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { questionId }) => [
        { type: 'Question', id: questionId },
      ],
    }),
  }),
});

export const {
  useGetQuestionsForAssignmentQuery,
  useGetQuestionByIdQuery,
  useAddQuestionToAssignmentMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionsApiSlice;
