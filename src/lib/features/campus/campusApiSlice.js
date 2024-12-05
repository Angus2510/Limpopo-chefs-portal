import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

// Setup an entity adapter
const campusAdapter = createEntityAdapter({});

const initialState = campusAdapter.getInitialState();

export const campusApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCampuses: builder.query({
      query: () => '/campuses',
      transformResponse: (responseData) => {
        const loadedCampuses = responseData.map((campus) => {
          campus.id = campus._id;
          return campus;
        });
        return campusAdapter.setAll(initialState, loadedCampuses);
      },
      providesTags: (result, error, arg) => [ 
        { type: 'Campus', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'Campus', id })),
      ],
    }), 

    getCampusById: builder.query({
      query: (id) => `/campuses/${id}`,
      transformResponse: (responseData) => {
        const campus = Array.isArray(responseData)
          ? responseData[0]
          : responseData;
        return campusAdapter.upsertOne(initialState, {
          ...campus,
          id: campus._id,
        });
      },
      providesTags: (result, error, id) => [{ type: 'Campus', id }],
    }),

    addNewCampus: builder.mutation({
      query: (formData) => {
        const { title } = formData;
        return {
          url: '/campuses',
          method: 'POST',
          body: { title },
        };
      },
      invalidatesTags: [{ type: 'Campus', id: 'LIST' }],
    }),

    updateCampus: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/campuses/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Campus', id: arg.id }],
    }),

    deleteCampus: builder.mutation({
      query: ({ id }) => ({
        url: '/campuses',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Campus', id: arg.id }],
    }),
  }),
});

// Export hooks for each query or mutation
export const {
  useGetCampusesQuery,
  useGetCampusByIdQuery,
  useAddNewCampusMutation,
  useUpdateCampusMutation,
  useDeleteCampusMutation,
} = campusApiSlice;

// Selectors for the campus entities
const selectCampusesResult = campusApiSlice.endpoints.getCampuses.select();
const selectCampusesData = createSelector(
  selectCampusesResult,
  (campusesResult) => campusesResult.data // normalized state object with ids & entities
);

// Entity adapter selectors
export const {
  selectAll: selectAllCampuses,
  selectById: selectCampusById,
  selectIds: selectCampusesIds,
} = campusAdapter.getSelectors(
  (state) => selectCampusesData(state) ?? initialState
);
