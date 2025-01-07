import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/app/api/apiSlice"; // Assuming apiSlice is properly set up for Next.js backend

// Setup an entity adapter
const campusAdapter = createEntityAdapter({});

const initialState = campusAdapter.getInitialState();

export const campusApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all campuses
    getCampuses: builder.query({
      query: () => "/api/campuses", // Adjust to your Next.js API route
      transformResponse: (responseData) => {
        // Transform response to match the shape Prisma returns
        const loadedCampuses = responseData.map((campus) => {
          campus.id = campus._id; // Assuming Prisma's response has an _id
          return campus;
        });
        return campusAdapter.setAll(initialState, loadedCampuses);
      },
      providesTags: (result, error, arg) => [
        { type: "Campus", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Campus", id })),
      ],
    }),

    // Get a single campus by ID
    getCampusById: builder.query({
      query: (id) => `/api/campuses/${id}`, // Adjust to Next.js API route for single campus
      transformResponse: (responseData) => {
        const campus = Array.isArray(responseData)
          ? responseData[0]
          : responseData;
        return campusAdapter.upsertOne(initialState, {
          ...campus,
          id: campus._id,
        });
      },
      providesTags: (result, error, id) => [{ type: "Campus", id }],
    }),

    // Create a new campus
    addNewCampus: builder.mutation({
      query: (formData) => {
        const { title } = formData;
        return {
          url: "/api/campuses", // Adjust to your Next.js API route
          method: "POST",
          body: { title },
        };
      },
      invalidatesTags: [{ type: "Campus", id: "LIST" }],
    }),

    // Update an existing campus
    updateCampus: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/campuses/${id}`, // Adjust to your Next.js API route
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Campus", id: arg.id }],
    }),

    // Delete a campus
    deleteCampus: builder.mutation({
      query: ({ id }) => ({
        url: "/api/campuses", // Adjust to Next.js API route for deletion
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Campus", id: arg.id }],
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
