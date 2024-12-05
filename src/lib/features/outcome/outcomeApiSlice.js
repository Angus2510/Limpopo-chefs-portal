import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

const outcomesAdapter = createEntityAdapter({});

const initialState = outcomesAdapter.getInitialState();

export const outcomesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOutcomes: builder.query({
      query: () => '/outcomes',
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        const loadedOutcomes = responseData.map((outcome) => {
          outcome.id = outcome._id;
          return outcome;
        });
        return outcomesAdapter.setAll(initialState, loadedOutcomes);
      },
      providesTags: (result, error, arg) => [
        { type: 'Outcome', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'Outcome', id })),
      ],
    }),

    getAllOutcomes: builder.query({
      query: () => '/outcomes/all',
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        const loadedOutcomes = responseData.map((outcome) => {
          outcome.id = outcome._id;
          return outcome;
        });
        return outcomesAdapter.setAll(initialState, loadedOutcomes);
      },
      providesTags: (result, error, arg) => [
        { type: 'Outcome', id: 'ALL' },
        ...result.ids.map((id) => ({ type: 'Outcome', id })),
      ],
    }),

    getOutcomeById: builder.query({
      query: (id) => `/outcomes/${id}`,
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData, meta, arg) => {
        const outcome = Array.isArray(responseData)
          ? responseData[0]
          : responseData;
        return outcomesAdapter.upsertOne(initialState, {
          ...outcome,
          id: outcome._id,
        });
      },
      providesTags: (result, error, id) => [{ type: 'Outcome', id }],
    }),

    addNewOutcome: builder.mutation({
      query: (formData) => ({
        url: '/outcomes',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Outcome', id: 'LIST' }],
    }),

    updateOutcome: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/outcomes/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Outcome', id: arg.id },
        { type: 'Outcome', id: 'LIST' },
        { type: 'Outcome', id: 'ALL' },
      ],
    }),

    deleteOutcome: builder.mutation({
      query: ({ id }) => ({
        url: '/outcomes',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Outcome', id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetOutcomesQuery,
  useGetAllOutcomesQuery,
  useGetOutcomeByIdQuery,
  useAddNewOutcomeMutation,
  useUpdateOutcomeMutation,
  useDeleteOutcomeMutation,
} = outcomesApiSlice;

// Returns the query result object
export const selectOutcomesResult =
  outcomesApiSlice.endpoints.getOutcomes.select();

export const selectAllOutcomesResult =
  outcomesApiSlice.endpoints.getAllOutcomes.select();

// Creates memoized selector
const selectOutcomesData = createSelector(
  selectOutcomesResult,
  (outcomesResult) => outcomesResult.data // normalized state object with ids & entities
);

const selectAllOutcomesData = createSelector(
  selectAllOutcomesResult,
  (outcomesResult) => outcomesResult.data // normalized state object with ids & entities
);

// Get selectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllOutcomes,
  selectById: selectOutcomeById,
  selectIds: selectOutcomesIds,
} = outcomesAdapter.getSelectors(
  (state) => selectOutcomesData(state) ?? initialState
);

export const {
  selectAll: selectAllOutcomesIncludingHidden,
  selectById: selectOutcomeByIdIncludingHidden,
  selectIds: selectOutcomesIdsIncludingHidden,
} = outcomesAdapter.getSelectors(
  (state) => selectAllOutcomesData(state) ?? initialState
);
