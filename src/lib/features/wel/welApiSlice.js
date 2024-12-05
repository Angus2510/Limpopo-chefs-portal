import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

// Creating an entity adapter to manage normalized data
const welAdapter = createEntityAdapter({});

// Initial state using the adapter
const initialState = welAdapter.getInitialState();

// Creating the API slice
export const welApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWel: builder.query({
      query: () => '/wel',
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        const loadedWel = responseData.map((wel) => {
          wel.id = wel._id;
          return wel;
        });
        return welAdapter.setAll(initialState, loadedWel);
      },
      providesTags: (result, error, arg) => [
        { type: 'Wel', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'Wel', id })),
      ],
    }),

    getWelById: builder.query({
      query: (id) => `/wel/${id}`,
      transformResponse: (responseData) => {
        return {
          ...responseData,
          id: responseData._id,
        };
      },
      providesTags: (result, error, id) => [{ type: 'Wel', id }],
    }),

    addNewWel: builder.mutation({
      query: (formData) => ({
        url: '/wel/create',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Wel', id: 'LIST' }],
    }),

    updateWel: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/wel/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Wel', id: arg.id }],
    }),

    deleteWel: builder.mutation({
      query: (id) => ({
        url: `/wel/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Wel', id }],
    }),
    
  }),
});


export const {
  useGetWelQuery,
  useAddNewWelMutation,
  useDeleteWelMutation,
  useGetWelByIdQuery,
  useUpdateWelMutation,
} = welApiSlice;

// Selecting the query result object
export const selectWelResult =
  welApiSlice.endpoints.getWel.select();

// Creating a memoized selector to access the data
const selectWelData = createSelector(
  selectWelResult,
  (welResult) => welResult.data // normalized state object with ids & entities
);

// Get selectors for easy access to normalized data
export const {
  selectAll: selectAllWels,
  selectById: selectWelById,
  selectIds: selectWelIds,
} = welAdapter.getSelectors(
  (state) => selectWelData(state) ?? initialState
);
