import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/app/api/apiSlice";

const intakeGroupsAdapter = createEntityAdapter({});

const initialState = intakeGroupsAdapter.getInitialState();

export const intakeGroupsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIntakeGroups: builder.query({
      query: () => "/intakegroups",
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        const loadedIntakeGroups = responseData.map((intakeGroup) => {
          intakeGroup.id = intakeGroup._id;
          return intakeGroup;
        });
        return intakeGroupsAdapter.setAll(initialState, loadedIntakeGroups);
      },
      providesTags: (result, error, arg) => [
        { type: "IntakeGroup", id: "LIST" },
        ...result.ids.map((id) => ({ type: "IntakeGroup", id })),
      ],
    }),

    getIntakeGroupById: builder.query({
      query: (id) => `/intakegroups/${id}`,
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData, meta, arg) => {
        const intakeGroup = Array.isArray(responseData)
          ? responseData[0]
          : responseData;
        return intakeGroupsAdapter.upsertOne(initialState, {
          ...intakeGroup,
          id: intakeGroup._id,
        });
      },
      providesTags: (result, error, id) => [{ type: "IntakeGroup", id }],
    }),

    addNewIntakeGroup: builder.mutation({
      query: (formData) => ({
        url: "/intakegroups",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "IntakeGroup", id: "LIST" }],
    }),

    updateIntakeGroup: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/intakegroups/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "IntakeGroup", id: arg.id },
      ],
    }),

    deleteIntakeGroup: builder.mutation({
      query: ({ id }) => ({
        url: "/intakegroups",
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

// returns the query result object
export const selectIntakeGroupsResult =
  intakeGroupsApiSlice.endpoints.getIntakeGroups.select();

// creates memoized selector
const selectIntakeGroupsData = createSelector(
  selectIntakeGroupsResult,
  (intakeGroupsResult) => intakeGroupsResult.data // normalized state object with ids & entities
);

// Get selectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllIntakeGroups,
  selectById: selectIntakeGroupById,
  selectIds: selectIntakeGroupsIds,
} = intakeGroupsAdapter.getSelectors(
  (state) => selectIntakeGroupsData(state) ?? initialState
);
