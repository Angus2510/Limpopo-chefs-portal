import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

// Setup an entity adapter
const qualificationAdapter = createEntityAdapter({});

const initialState = qualificationAdapter.getInitialState();

export const qualificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQualifications: builder.query({
      query: () => '/qualifications',
      transformResponse: (responseData) => {
        const loadedQualifications = responseData.map((qualification) => {
          qualification.id = qualification._id;
          return qualification;
        });
        return qualificationAdapter.setAll(initialState, loadedQualifications);
      },
      providesTags: (result, error, arg) => [ 
        { type: 'Qualification', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'Qualification', id })),
      ],
    }), 

    getQualificationById: builder.query({
      query: (id) => `/qualifications/${id}`,
      transformResponse: (responseData) => {
        const qualification = Array.isArray(responseData)
          ? responseData[0]
          : responseData;
        return qualificationAdapter.upsertOne(initialState, {
          ...qualification,
          id: qualification._id,
        });
      },
      providesTags: (result, error, id) => [{ type: 'Qualification', id }],
    }),

    addNewQualification: builder.mutation({
      query: (formData) => {
        const { title } = formData;
        return {
          url: '/qualifications',
          method: 'POST',
          body: { title },
        };
      },
      invalidatesTags: [{ type: 'Qualification', id: 'LIST' }],
    }),

    updateQualification: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/qualifications/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Qualification', id: arg.id }],
    }),

    deleteQualification: builder.mutation({
      query: ({ id }) => ({
        url: '/qualifications',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Qualification', id: arg.id }],
    }),
  }),
});

// Export hooks for each query or mutation
export const {
  useGetQualificationsQuery,
  useGetQualificationByIdQuery,
  useAddNewQualificationMutation,
  useUpdateQualificationMutation,
  useDeleteQualificationMutation,
} = qualificationApiSlice;

// Selectors for the qualification entities
const selectQualificationsResult = qualificationApiSlice.endpoints.getQualifications.select();
const selectQualificationsData = createSelector(
  selectQualificationsResult,
  (qualificationsResult) => qualificationsResult.data 
);

// Entity adapter selectors
export const {
  selectAll: selectAllQualifications,
  selectById: selectQualificationById,
  selectIds: selectQualificationsIds,
} = qualificationAdapter.getSelectors(
  (state) => selectQualificationsData(state) ?? initialState
);
