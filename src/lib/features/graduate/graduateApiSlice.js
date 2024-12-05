import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

export const graduateApiSlice =  apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        GraduateStudents: builder.mutation({
            query: (formData) => ({
              url: '/graduate',
              method: 'POST',
              body: formData,
            }),
            invalidatesTags: [{ type: 'Graduate', id: 'LIST' }],
          }),
    }),
});


export const { useGraduateStudentsMutation } = graduateApiSlice;
export default graduateApiSlice;