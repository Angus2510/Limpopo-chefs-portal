import { apiSlice } from '@/app/api/apiSlice';

export const changeStudentIntakeGroupApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    changeStudentIntakeGroup: builder.mutation({
      query: (formData) => ({
        url: '/update-student-intakegroup',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Student', id: 'LIST' }],
    }),
  }),
});

export const {
  useChangeStudentIntakeGroupMutation,
} = changeStudentIntakeGroupApiSlice;
