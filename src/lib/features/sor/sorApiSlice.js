import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

const sorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateSorReport: builder.mutation({
      query: (studentIds) => ({
        url: `/results/sor/${studentIds.join(',')}`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'students_results.zip'); 
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        } catch (error) {
          console.error('Failed to generate report:', error);
        }
      },
    }),
  }),
});

export const { useGenerateSorReportMutation } = sorApiSlice;
export default sorApiSlice;
