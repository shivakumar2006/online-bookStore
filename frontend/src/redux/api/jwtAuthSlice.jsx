import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; 

export const jwtAuthApi = createApi({
    reducerPath: "jwtAuthApi",
    baseQuery: fetchBaseQuery({ 
        baseUrl: "http://localhost:8081"
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials,
            }),
        }),
        signup: builder.mutation({
            query: (userData) => ({
                url: "/signup",
                method: "POST",
                body: userData, 
            }),
        }),
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: "/forgot-password",
                method: "POST",
                body: {email},
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ token, new_password }) => ({
                url: "/reset-password",
                method: "POST",
                body: { token, new_password},
            }),
        }),
        getUser: builder.query({
            query: () => "/me",
        })
    })
})

export const { useLoginMutation, useSignupMutation, useForgotPasswordMutation, useResetPasswordMutation, useGetUserQuery } = jwtAuthApi;