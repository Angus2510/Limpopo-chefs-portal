import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { fetchToken } from "@/utils/fetchToken";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Check if args is an object and if the request is for password reset (or another endpoint that doesn't require a token)
  const isPasswordResetRequest =
    typeof args === "object" && args.url === "/auth/reset-password";

  // If it's a password reset request, skip the token fetching completely
  if (isPasswordResetRequest) {
    const baseQuery = fetchBaseQuery({
      baseUrl: baseUrl,
    });
    return baseQuery(args, api, extraOptions);
  }

  // Otherwise, fetch the token as usual
  let token = await fetchToken();
  console.log("Fetched token:", token);

  const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  return baseQuery(args, api, extraOptions);
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Student", "Assignment", "Question", "Answer"],
  endpoints: (builder) => ({
    getSomeData: builder.query({
      query: () => "/some-data",
    }),

    search: builder.query({
      query: (query: string) => ({
        url: "/search",
        params: { query },
      }),
    }),

    // Define your other API endpoints here
    resetPassword: builder.mutation({
      query: (email: string) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { email },
      }),
    }),

    // Add any additional endpoints you might need
  }),
});

export const { useGetSomeDataQuery, useSearchQuery, useResetPasswordMutation } =
  apiSlice;
