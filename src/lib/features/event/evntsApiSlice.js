import { apiSlice } from '@/app/api/apiSlice';

export const eventsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => '/events',
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
            { type: 'Event', id: 'LIST' },
            ...result.map(({ id }) => ({ type: 'Event', id })),
          ];
        } else return [{ type: 'Event', id: 'LIST' }];
      },
    }),

    createEvent: builder.mutation({
      query: (newEvent) => ({
        url: '/events',
        method: 'POST',
        body: newEvent,
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),

    updateEvent: builder.mutation({
      query: ({ id, ...updatedEvent }) => ({
        url: `/events/${id}`,
        method: 'PUT',
        body: updatedEvent,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Event', id }],
    }),

    deleteEvent: builder.mutation({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),
  }),
});

export const { useGetEventsQuery, useCreateEventMutation, useUpdateEventMutation, useDeleteEventMutation } = eventsApiSlice;
