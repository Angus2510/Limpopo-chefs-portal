import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

// Create an entity adapter for uploads
const uploadsAdapter = createEntityAdapter({});

const initialState = uploadsAdapter.getInitialState();

export const uploadsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query({
      query: () => '/fileUploads',
      transformResponse: (responseData) => {
        const loadedDocuments = responseData.map((document) => {
          document.id = document._id; // Assuming _id is the field returned by your backend
          return document;
        });
        return uploadsAdapter.setAll(initialState, loadedDocuments);
      },
      providesTags: (result, error, arg) => [
        { type: 'Document', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'Document', id })),
      ],
    }),

    getDocumentById: builder.query({
      query: (id) => `/fileUploads/${id}`,
      transformResponse: (responseData) => {
        const document = Array.isArray(responseData)
          ? responseData[0]
          : responseData;
        return uploadsAdapter.upsertOne(initialState, {
          ...document,
          id: document._id,
        });
      },
      providesTags: (result, error, id) => [{ type: 'Document', id }],
    }),

    uploadDocument: builder.mutation({
      query: (formData) => ({
        url: '/fileUploads',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Document', id: 'LIST' }],
    }),

    updateDocument: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/fileUploads/${id}`,
        method: 'PATCH',
        body: formData,
        headers: {},
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Document', id: arg.id },
      ],
    }),

    deleteDocument: builder.mutation({
      query: ({ id }) => ({
        url: `/fileUploads/${id}`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Document', id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetDocumentByIdQuery,
  useUploadDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
} = uploadsApiSlice;

// Selectors for normalized data
const selectUploadsResult = uploadsApiSlice.endpoints.getDocuments.select();
const selectUploadsData = createSelector(
  selectUploadsResult,
  (uploadsResult) => uploadsResult.data // normalized state object with ids & entities
);

export const {
  selectAll: selectAllDocuments,
  selectById: selectDocumentById,
  selectIds: selectDocumentsIds,
} = uploadsAdapter.getSelectors(
  (state) => selectUploadsData(state) ?? initialState
);
