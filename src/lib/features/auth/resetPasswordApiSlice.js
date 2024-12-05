import { apiSlice } from "@/app/api/apiSlice";

const resetPasswordEndpoints = apiSlice.injectEndpoints({
    endpoints: builder => ({
        requestPasswordReset: builder.mutation({
            query: ({ identifier }) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: { identifier },
            })
        }),
        confirmPasswordReset: builder.mutation({
            query: ({ data }) => ({
                url: `/auth/reset-password/confirm`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            })
        }),
    })
});

export const {
    useRequestPasswordResetMutation,
    useConfirmPasswordResetMutation,
} = resetPasswordEndpoints;
