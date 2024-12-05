import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

const rolesAdapter = createEntityAdapter({});

const initialState = rolesAdapter.getInitialState();

export const rolesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => '/roles/all',
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        const loadedRoles = responseData.map((role) => {
          role.id = role._id; 
          return role;
        });
        return rolesAdapter.setAll(initialState, loadedRoles);
      },
      providesTags: (result, error, arg) => [
        { type: 'Role', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'Role', id })),
      ],
    }),

    updateRole: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/roles/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Role', id: arg.id },
      ],
    }),

    addNewRole: builder.mutation({
      query: (newRole) => ({
        url: '/roles',
        method: 'POST',
        body: newRole,
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),

    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useUpdateRoleMutation,
  useAddNewRoleMutation,
  useDeleteRoleMutation,
} = rolesApiSlice;

// returns the query result object
export const selectRolesResult =
  rolesApiSlice.endpoints.getRoles.select();

// creates memoized selector
const selectRolesData = createSelector(
  selectRolesResult,
  (rolesResult) => rolesResult.data // normalized state object with ids & entities
);

// Get selectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllRoles,
  selectById: selectRoleById,
  selectIds: selectRolesIds,
} = rolesAdapter.getSelectors(
  (state) => selectRolesData(state) ?? initialState
);
