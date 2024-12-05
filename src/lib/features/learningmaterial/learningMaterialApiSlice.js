import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

// Creating an entity adapter to manage normalized data
const learningMaterialsAdapter = createEntityAdapter({});

// Initial state using the adapter
const initialState = learningMaterialsAdapter.getInitialState();

// Creating the API slice
export const learningMaterialApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLearningMaterials: builder.query({
      query: () => '/learning-material',
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        const loadedLearningMaterials = responseData.map((learningMaterial) => {
          learningMaterial.id = learningMaterial._id;
          return learningMaterial;
        });
        return learningMaterialsAdapter.setAll(initialState, loadedLearningMaterials);
      },
      providesTags: (result, error, arg) => [
        { type: 'LearningMaterial', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'LearningMaterial', id })),
      ],
    }),

 
    getLearningMaterialsByStudentId: builder.query({
      query: (studentId) => `/learning-material/student/${studentId}`,
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        const loadedLearningMaterials = responseData.map((learningMaterial) => {
          learningMaterial.id = learningMaterial._id;
          return learningMaterial;
        });
        return learningMaterialsAdapter.setAll(initialState, loadedLearningMaterials);
      },
      providesTags: (result, error, arg) => [
        { type: 'LearningMaterial', id: 'LIST' },
        ...(result?.ids ? result.ids.map((id) => ({ type: 'LearningMaterial', id })) : []),
      ],
    }),

    addNewLearningMaterial: builder.mutation({
      query: (formData) => ({
        url: '/learning-material/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'LearningMaterial', id: 'LIST' }],
    }),

    deleteLearningMaterial: builder.mutation({
      query: ({ id }) => ({
        url: `/learning-material`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'LearningMaterial', id: arg.id },
      ],
    }),

    deleteMultipleLearningMaterials: builder.mutation({
      query: (ids) => ({
        url: `/learning-material/delete-multiple`,
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'LearningMaterial', id: 'LIST' },
      ],
    }),

    downloadLearningMaterial: builder.query({
      query: (id) => ({
        url: `/learning-material/download/${id}`,
        method: 'GET',
      }),
    }),
    
  }),
});


export const {
  useGetLearningMaterialsQuery,
  useGetLearningMaterialsByStudentIdQuery,
  useAddNewLearningMaterialMutation,
  useDeleteLearningMaterialMutation,
  useDeleteMultipleLearningMaterialsMutation,
  useLazyDownloadLearningMaterialQuery,
} = learningMaterialApiSlice;

// Selecting the query result object
export const selectLearningMaterialsResult =
  learningMaterialApiSlice.endpoints.getLearningMaterials.select();

// Creating a memoized selector to access the data
const selectLearningMaterialsData = createSelector(
  selectLearningMaterialsResult,
  (learningMaterialsResult) => learningMaterialsResult.data // normalized state object with ids & entities
);

// Get selectors for easy access to normalized data
export const {
  selectAll: selectAllLearningMaterials,
  selectById: selectLearningMaterialById,
  selectIds: selectLearningMaterialIds,
} = learningMaterialsAdapter.getSelectors(
  (state) => selectLearningMaterialsData(state) ?? initialState
);
