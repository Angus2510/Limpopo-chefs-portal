import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/app/api/apiSlice";

const intakeGroupsAdapter = createEntityAdapter({});

const initialState = intakeGroupsAdapter.getInitialState();

export const intakeGroupsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all intake groups
    getIntakeGroups: builder.query({
      query: () => "/api/intakegroups", // Adjust to your Next.js API route
      transformResponse: (responseData) => {
        const loadedIntakeGroups = responseData.map((intakeGroup) => {
          intakeGroup.id = intakeGroup._id; // Adjust Prisma field (_id) if necessary
          return intakeGroup;
        });
        return intakeGroupsAdapter.setAll(initialState, loadedIntakeGroups);
      },
      providesTags: (result, error, arg) => [
        { type: "IntakeGroup", id: "LIST" },
        ...result.ids.map((id) => ({ type: "IntakeGroup", id })),
      ],
    }),

    // Get a single intake group by ID
    getIntakeGroupById: builder.query({
      query: (id) => `/api/intakegroups/${id}`, // Adjust to your Next.js API route
      transformResponse: (responseData) => {
        const intakeGroup = Array.isArray(responseData)
          ? responseData[0]
          : responseData;
        return intakeGroupsAdapter.upsertOne(initialState, {
          ...intakeGroup,
          id: intakeGroup._id, // Adjust if necessary
        });
      },
      providesTags: (result, error, id) => [{ type: "IntakeGroup", id }],
    }),

    // Add a new intake group
    addNewIntakeGroup: builder.mutation({
      query: (formData) => ({
        url: "/api/intakegroups", // Adjust to your Next.js API route
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "IntakeGroup", id: "LIST" }],
    }),

    // Update an existing intake group
    updateIntakeGroup: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/intakegroups/${id}`, // Adjust to your Next.js API route
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "IntakeGroup", id: arg.id },
      ],
    }),

    // Delete an intake group
    deleteIntakeGroup: builder.mutation({
      query: ({ id }) => ({
        url: "/api/intakegroups", // Adjust to your Next.js API route for deletion
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "IntakeGroup", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetIntakeGroupsQuery,
  useGetIntakeGroupByIdQuery,
  useAddNewIntakeGroupMutation,
  useUpdateIntakeGroupMutation,
  useDeleteIntakeGroupMutation,
} = intakeGroupsApiSlice;

// Returns the query result object
export const selectIntakeGroupsResult =
  intakeGroupsApiSlice.endpoints.getIntakeGroups.select();

// Creates memoized selector
const selectIntakeGroupsData = createSelector(
  selectIntakeGroupsResult,
  (intakeGroupsResult) => intakeGroupsResult.data // Normalized state object with ids & entities
);

// Entity adapter selectors
export const {
  selectAll: selectAllIntakeGroups,
  selectById: selectIntakeGroupById,
  selectIds: selectIntakeGroupsIds,
} = intakeGroupsAdapter.getSelectors(
  (state) => selectIntakeGroupsData(state) ?? initialState
);
