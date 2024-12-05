import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '@/app/api/apiSlice';

const alumniAdapter = createEntityAdapter({});

const initialState = alumniAdapter.getInitialState();

export const alumniApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAlumni: builder.query({
      query: () => '/alumni',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedAlumni = responseData.map((student) => {
          student.id = student._id;
          return student;
        });
        return alumniAdapter.setAll(initialState, loadedAlumni);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Alumni', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Alumni', id })),
          ];
        } else return [{ type: 'Alumni', id: 'LIST' }];
      },
    }),

    getAlumniById: builder.query({
      query: (id) => `/alumni/${id}`,
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData, meta, arg) => {
        const alumni = Array.isArray(responseData)
          ? responseData[0]
          : responseData;
        return alumniAdapter.upsertOne(initialState, {
          ...alumni,
          id: alumni._id,
        });
      },
      providesTags: (result, error, id) => [{ type: 'Alumni', id }],
    }),

    updateAlumni: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/alumni/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Alumni', id: arg.id },
      ],
    }),

    toggleAlumniStatus: builder.mutation({
      query: (id) => ({
        url: `/alumni/toggle/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Alumni', id }],
    }),
  }),
});

export const {
  useGetAlumniQuery,
  useGetAlumniByIdQuery,
  useUpdateAlumniMutation,
  useToggleAlumniStatusMutation, 
} = alumniApiSlice;

export const selectAlumniResult =
  alumniApiSlice.endpoints.getAlumni.select();

const selectAlumniData = createSelector(
  selectAlumniResult,
  (alumniResult) => alumniResult.data 
);

export const {
  selectAll: selectAllAlumni,
  selectById: selectAlumniById,
  selectIds: selectAlumniIds,
} = alumniAdapter.getSelectors(
  (state) => selectAlumniData(state) ?? initialState
);
