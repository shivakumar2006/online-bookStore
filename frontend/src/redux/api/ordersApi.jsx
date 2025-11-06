import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:8084",
    baseUrl: "http://bookstore.local/api",
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token =
        state.auth?.token ||
        state.auth?.user?.access_token ||
        state.auth?.session?.access_token ||
        state.auth?.user?.token; // fallback

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Orders"],

  endpoints: (builder) => ({
    placeOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders/create",
        method: "POST",
        body: JSON.stringify(orderData),
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
        body: JSON.stringify({ orderId }),
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetOrdersQuery,
  useCancelOrderMutation,
} = ordersApi;
