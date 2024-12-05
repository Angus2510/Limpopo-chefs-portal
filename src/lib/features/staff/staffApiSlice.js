import { apiSlice } from '@/app/api/apiSlice';
import { createEntityAdapter } from '@reduxjs/toolkit';

const staffAdapter = createEntityAdapter({});

const initialState = staffAdapter.getInitialState();

export const staffApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStaff: builder.query({
      query: () => '/staff',
      transformResponse: (responseData) => {
        const loadedStaff = responseData.map((staff) => {
          staff.id = staff._id;
          return staff;
        });
        return staffAdapter.setAll(initialState, loadedStaff);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Staff', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Staff', id })),
          ];
        } else return [{ type: 'Staff', id: 'LIST' }];
      },
    }),

    getStaffById: builder.query({
      query: (id) => `/staff/${id}`,
      providesTags: (result, error, id) => [{ type: 'Staff', id }],
    }),

    updateStaff: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/staff/${id}`,
        method: 'PUT',
        body: formData,
        headers: {},
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Staff', id: arg.id }],
    }),

    addNewStaff: builder.mutation({
      query: (newStaff) => ({
        url: '/staff',
        method: 'POST',
        body: newStaff,
      }),
      invalidatesTags: [{ type: 'Staff', id: 'LIST' }],
    }),

    deleteStaff: builder.mutation({
      query: (id) => ({
        url: `/staff/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Staff', id: arg.id }],
    }),

    toggleStaffActiveStatus: builder.mutation({
      query: (id) => ({
        url: `/staff/${id}/toggle-active`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Staff', id: arg.id }],
    }),
  }),
});

export const {
  useGetStaffQuery,
  useGetStaffByIdQuery,
  useAddNewStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useToggleStaffActiveStatusMutation,
} = staffApiSlice;
