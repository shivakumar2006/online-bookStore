import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8082", // ✅ fixed
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token =
        state.auth?.token ||
        state.auth?.user?.access_token ||
        state.auth?.session?.access_token;

        console.log("🧠 Token from Redux:", token);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/cart", // ✅ correct route
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: ({ bookId, quantity }) => ({
        url: "/cart/add",
        method: "POST",
        body: { bookId, quantity },
      }),
      invalidatesTags: ["Cart"], // ✅ should invalidate not provide
    }),

    removeFromCart: builder.mutation({
      query: (bookId) => ({
        url: `/cart/remove?bookId=${bookId}`, // ✅ must be query param
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    increaseQuantity: builder.mutation({
        query: (bookId) => ({
            url: `/cart/increase?bookId=${bookId}`,
            method: "PATCH"
        }),
        invalidatesTags: ["Cart"]
    }),

    decreaseQuantity: builder.mutation({
        query: (bookId) => ({
            url: `/cart/decrease?bookId=${bookId}`,
            method: "PATCH",
        }),
        invalidatesTags: ["Cart"]
    })
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useIncreaseQuantityMutation,
  useDecreaseQuantityMutation,
} = cartApi;
