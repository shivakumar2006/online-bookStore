import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8085",
    // baseUrl: "http://bookstore.local/api",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token =
        state.auth?.token ||
        state.auth?.user?.access_token ||
        state.auth?.session?.access_token ||
        state.auth?.user?.token; // fallback

      console.log("💥 paymentApi token =>", token);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Payment"],

  endpoints: (builder) => ({
    createPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/payment/create-checkout-session",
        method: "POST",
        body: JSON.stringify(paymentData), // ✅ safely stringified
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const { useCreatePaymentMutation } = paymentApi;
