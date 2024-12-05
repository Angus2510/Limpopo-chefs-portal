import { apiSlice } from '@/app/api/apiSlice';

export const importantInfoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateImportantInformation: builder.mutation({
      query: ({ id, importantInformation }) => ({
        url: `/students/imporantinfo/${id}`,
        method: 'POST',
        body: { importantInformation },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Student', id: arg.id },
      ],
    }),
  }),
});

export const {
  useUpdateImportantInformationMutation,
} = importantInfoApiSlice;
