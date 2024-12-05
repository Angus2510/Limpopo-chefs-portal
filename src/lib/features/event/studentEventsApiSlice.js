import { apiSlice } from '@/app/api/apiSlice';

export const studentEventsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudentEvents: builder.query({
      query: (studentId) => `/events/student/${studentId}/events`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        return responseData.map(event => ({
          ...event, 
          id: event._id,
          start: event.startDate,
          end: event.endDate,
        }));
      },
      providesTags: (result, error, arg) => {
        if (result) {
          return [
            { type: 'StudentEvent', id: 'LIST' },
            ...result.map(({ id }) => ({ type: 'StudentEvent', id })),
          ];
        } else return [{ type: 'StudentEvent', id: 'LIST' }];
      },
    }),
  }),
});

export const { useGetStudentEventsQuery } = studentEventsApiSlice;
