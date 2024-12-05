import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

const accommodationAdapter = createEntityAdapter();

const initialState = accommodationAdapter.getInitialState();

export const accommodationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAccommodations: builder.query({
      query: () => '/accommodations',
      transformResponse: (responseData) => {
        const loadedAccommodations = responseData.map((accommodation) => {
          accommodation.id = accommodation._id;
          return accommodation;
        });
        return accommodationAdapter.setAll(initialState, loadedAccommodations);
      },
      providesTags: (result, error, arg) => [
        { type: 'Accommodation', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'Accommodation', id })),
      ],
    }),

    getAvailableAccommodations: builder.query({
      query: () => '/accommodations/available',
      transformResponse: (responseData) => {
        const loadedAccommodations = responseData.map((accommodation) => {
          accommodation.id = accommodation._id;
          return accommodation;
        });
        return accommodationAdapter.setAll(initialState, loadedAccommodations);
      },
      providesTags: (result, error, arg) => [
        { type: 'Accommodation', id: 'LIST_AVAILABLE' },
        ...result.ids.map((id) => ({ type: 'Accommodation', id })),
      ],
    }),

    getAccommodationById: builder.query({
      query: (id) => `/accommodations/${id}`,
      transformResponse: (responseData) => {
        const accommodation = {
          ...responseData,
          id: responseData._id,
        };
        return accommodationAdapter.upsertOne(initialState, accommodation);
      },
      providesTags: (result, error, id) => [{ type: 'Accommodation', id }],
    }),
    addNewAccommodation: builder.mutation({
      query: (formData) => ({
        url: '/accommodations',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Accommodation', id: 'LIST' }],
    }),
    updateAccommodation: builder.mutation({
      query: ({ id, ...formData }) => ({
        url: `/accommodations/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Accommodation', id: arg.id }],
    }),
    deleteAccommodation: builder.mutation({
      query: (id) => ({
        url: `/accommodations/${id}`, // Ensure the URL includes the ID of the accommodation to delete
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Accommodation', id: arg }],
    }),
  }),
});

export const {
  useGetAccommodationsQuery,
  useGetAvailableAccommodationsQuery,
  useGetAccommodationByIdQuery,
  useAddNewAccommodationMutation,
  useUpdateAccommodationMutation,
  useDeleteAccommodationMutation,
} = accommodationApiSlice;

const selectAccommodationsResult = accommodationApiSlice.endpoints.getAccommodations.select();
const selectAccommodationsData = createSelector(
  selectAccommodationsResult,
  (accommodationsResult) => accommodationsResult.data ?? initialState
);

export const {
  selectAll: selectAllAccommodations,
  selectById: selectAccommodationById,
  selectIds: selectAccommodationsIds,
} = accommodationAdapter.getSelectors((state) => selectAccommodationsData(state));
