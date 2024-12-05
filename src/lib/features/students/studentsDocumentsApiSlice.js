import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

// Creating an entity adapter to manage normalized data
const documentsAdapter = createEntityAdapter({});

// Initial state using the adapter
const initialState = documentsAdapter.getInitialState();

// Creating the API slice
export const studentDocumentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeneralDocuments: builder.query({
      query: () => 'students/generaldocs',
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        const loadedDocuments = responseData.map((document) => {
          document.id = document._id;
          return document;
        });
        return documentsAdapter.setAll(initialState, loadedDocuments);
      },
      providesTags: (result, error, arg) => [
        { type: 'GeneralDocument', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'GeneralDocument', id })),
      ],
    }),

    getLegalDocuments: builder.query({
      query: () => 'students/legaldocs',
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        const loadedDocuments = responseData.map((document) => {
          document.id = document._id;
          return document;
        });
        return documentsAdapter.setAll(initialState, loadedDocuments);
      },
      providesTags: (result, error, arg) => [
        { type: 'LegalDocument', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'LegalDocument', id })),
      ],
    }),

    getGeneralDocumentsByStudentId: builder.query({
      query: (studentId) => `students/generaldocs/student/${studentId}`,
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        const loadedDocuments = responseData.map((document) => {
          document.id = document._id;
          return document;
        });
        return documentsAdapter.setAll(initialState, loadedDocuments);
      },
      providesTags: (result, error, arg) => [
        { type: 'GeneralDocument', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'GeneralDocument', id })),
      ],
    }),

    getLegalDocumentsByStudentId: builder.query({
      query: (studentId) => `students/legaldocs/student/${studentId}`,
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        const loadedDocuments = responseData.map((document) => {
          document.id = document._id;
          return document;
        });
        return documentsAdapter.setAll(initialState, loadedDocuments);
      },
      providesTags: (result, error, arg) => [
        { type: 'LegalDocument', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'LegalDocument', id })),
      ],
    }),

    addNewGeneralDocument: builder.mutation({
      query: (formData) => ({
        url: 'students/generaldocs/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'GeneralDocument', id: 'LIST' }],
    }),

    addNewLegalDocument: builder.mutation({
      query: (formData) => ({
        url: 'students/legaldocs/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'LegalDocument', id: 'LIST' }],
    }),

    deleteGeneralDocument: builder.mutation({
      query: ({ id }) => ({
        url: `students/generaldocs/delete-multiple`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'GeneralDocument', id: arg.id },
      ],
    }),

    deleteLegalDocument: builder.mutation({
      query: ({ id }) => ({
        url: `students/legaldocs/delete-multiple`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'LegalDocument', id: arg.id },
      ],
    }),

    deleteMultipleGeneralDocuments: builder.mutation({
      query: (ids) => ({
        url: `students/generaldocs/delete-multiple`,
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'GeneralDocument', id: 'LIST' },
      ],
    }),

    deleteMultipleLegalDocuments: builder.mutation({
      query: (ids) => ({
        url: `students/legaldocs/delete-multiple`,
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'LegalDocument', id: 'LIST' },
      ],
    }),

    downloadGeneralDocument: builder.query({
      query: (id) => ({
        url: `students/generaldocs/download/${id}`,
        method: 'GET',
      }),
    }),

    downloadLegalDocument: builder.query({
      query: (id) => ({
        url: `students/legaldocs/download/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetGeneralDocumentsQuery,
  useGetLegalDocumentsQuery,
  useGetGeneralDocumentsByStudentIdQuery,
  useGetLegalDocumentsByStudentIdQuery,
  useAddNewGeneralDocumentMutation,
  useAddNewLegalDocumentMutation,
  useDeleteGeneralDocumentMutation,
  useDeleteLegalDocumentMutation,
  useDeleteMultipleGeneralDocumentsMutation,
  useDeleteMultipleLegalDocumentsMutation,
  useLazyDownloadGeneralDocumentQuery,
  useLazyDownloadLegalDocumentQuery,
} = studentDocumentsApiSlice;

// Selecting the query result object
export const selectGeneralDocumentsResult =
  studentDocumentsApiSlice.endpoints.getGeneralDocuments.select();

export const selectLegalDocumentsResult =
  studentDocumentsApiSlice.endpoints.getLegalDocuments.select();

// Creating a memoized selector to access the data
const selectGeneralDocumentsData = createSelector(
  selectGeneralDocumentsResult,
  (generalDocumentsResult) => generalDocumentsResult.data // normalized state object with ids & entities
);

const selectLegalDocumentsData = createSelector(
  selectLegalDocumentsResult,
  (legalDocumentsResult) => legalDocumentsResult.data // normalized state object with ids & entities
);

// Get selectors for easy access to normalized data
export const {
  selectAll: selectAllGeneralDocuments,
  selectById: selectGeneralDocumentById,
  selectIds: selectGeneralDocumentIds,
} = documentsAdapter.getSelectors(
  (state) => selectGeneralDocumentsData(state) ?? initialState
);

export const {
  selectAll: selectAllLegalDocuments,
  selectById: selectLegalDocumentById,
  selectIds: selectLegalDocumentIds,
} = documentsAdapter.getSelectors(
  (state) => selectLegalDocumentsData(state) ?? initialState
);
