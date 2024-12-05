import { apiSlice } from '@/app/api/apiSlice';

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (userId) => `/notifications/${userId}`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        return responseData.map(notification => ({
          ...notification,
          id: notification._id,
        }));
      },
      providesTags: (result, error, arg) => {
        if (result) {
          return [
            { type: 'Notification', id: 'LIST' },
            ...result.map(({ id }) => ({ type: 'Notification', id })),
          ];
        } else return [{ type: 'Notification', id: 'LIST' }];
      },
    }),

    createNotification: builder.mutation({
      query: (notification) => ({
        url: '/notifications/staff',
        method: 'POST',
        body: notification,
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    deleteNotification: builder.mutation({
      query: ({ userId, notificationId }) => ({
        url: `/notifications/${userId}/${notificationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
    deleteAllNotifications: builder.mutation({
      query: (userId) => ({
        url: `/notifications/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
  }),
});

export const { useGetNotificationsQuery, useCreateNotificationMutation, useDeleteNotificationMutation, useDeleteAllNotificationsMutation } = notificationsApiSlice;
