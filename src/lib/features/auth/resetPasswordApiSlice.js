import { apiSlice } from "@/app/api/apiSlice";

const resetPasswordEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    requestPasswordReset: builder.mutation({
      query: ({ email }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { email },
      }),
    }),
  }),
});

export const { useRequestPasswordResetMutation } = resetPasswordEndpoints;
