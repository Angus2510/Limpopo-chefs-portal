import { apiSlice } from '@/app/api/apiSlice';

export const answersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnswersForQuestion: builder.query({
      query: ({ assignmentId, questionId }) =>
        `/assignments/${assignmentId}/questions/${questionId}/answers`,
      providesTags: (result, error, { assignmentId, questionId }) =>
        result
          ? result.map((answer) => ({
              type: 'Answer',
              id: answer.id,
              parent: questionId,
            }))
          : [{ type: 'Question', id: questionId }],
    }),
    getAnswerById: builder.query({
      query: ({ assignmentId, questionId, answerId }) =>
        `/assignments/${assignmentId}/questions/${questionId}/answers/${answerId}`,
      providesTags: (result, error, { answerId }) => [
        { type: 'Answer', id: answerId },
      ],
    }),
    addAnswerToQuestion: builder.mutation({
      query: ({ assignmentId, questionId, answer }) => ({
        url: `/assignments/${assignmentId}/questions/${questionId}/answers`,
        method: 'POST',
        body: answer,
      }),
      invalidatesTags: (result, error, { questionId }) => [
        { type: 'Question', id: questionId },
      ],
    }),
    updateAnswer: builder.mutation({
      query: ({ assignmentId, questionId, answerId, ...patch }) => ({
        url: `/assignments/${assignmentId}/questions/${questionId}/answers/${answerId}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { answerId }) => [
        { type: 'Answer', id: answerId },
      ],
    }),
    deleteAnswer: builder.mutation({
      query: ({ assignmentId, questionId, answerId }) => ({
        url: `/assignments/${assignmentId}/questions/${questionId}/answers/${answerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { answerId }) => [
        { type: 'Answer', id: answerId },
      ],
    }),
  }),
});

export const {
  useGetAnswersForQuestionQuery,
  useGetAnswerByIdQuery,
  useAddAnswerToQuestionMutation,
  useUpdateAnswerMutation,
  useDeleteAnswerMutation,
} = answersApiSlice;
