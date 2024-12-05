import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { fetchToken } from '@/utils/fetchToken';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {

  let token = await fetchToken();
  console.log("Fetched token:", token); 

  console.log(token)
 
  const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  return baseQuery(args, api, extraOptions);
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Student', 'Assignment', 'Question', 'Answer'],
  endpoints: (builder) => ({
    getSomeData: builder.query({
      query: () => '/some-data',
    }),

  search: builder.query({
    query: (query: string) => ({
      url: '/search',
      params: { query },
    }),
  }),

  }),
});

export const { useGetSomeDataQuery, useSearchQuery } = apiSlice;
