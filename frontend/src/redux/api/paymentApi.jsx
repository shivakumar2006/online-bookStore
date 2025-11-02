import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
    reducerPath: "paymentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8085",
    }),
    endpoints: (builder) => ({
        createPayment: builder.mutation({
            query: (paymentData) => ({
                url: "/payment/create-checkout-session",
                method: "POST",
                body: paymentData,
                headers: {"Content-Type": "application/json"}
            })
        })
    })
})

export const { useCreatePaymentMutation } = paymentApi;