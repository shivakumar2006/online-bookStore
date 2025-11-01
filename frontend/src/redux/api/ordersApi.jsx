import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
    reducerPath: "ordersApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8084",
        prepareHeaders: (headers, { getState }) => {
            const token = getState()?.auth?.user?.token; 
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            headers.set("Content-Type", "application/json")
            return headers;
        }
    }),
    tagTypes: ["Orders"],

    endpoints: (builder) => ({
        placeOrder: builder.mutation({
            query: (orderData) => ({
                url: "/orders/create",
                method: "POST",
                body: orderData,
            }),
            invalidatesTags: ["Orders"],
        }),

        getOrders: builder.query({
            query: () => "/orders",
            providesTags: ["Orders"],
        }),

        cancelOrder: builder.mutation({
            query: (orderId) => ({
                url: "/orders/cancel",
                method: "PATCH",
                body: { orderId },
            }),
            invalidatesTags: ["Orders"],
        })
    })
})

export const {  usePlaceOrderMutation, useGetOrdersQuery, useCancelOrderMutation } = ordersApi;