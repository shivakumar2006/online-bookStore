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
    // 🛒 Fetch user cart
    getCart: builder.query({
      query: () => "/cart", // ✅ correct route
      providesTags: ["Cart"],
    }),

    // ➕ Add to cart
    addToCart: builder.mutation({
      query: ({ bookId, quantity }) => ({
        url: "/cart/add",
        method: "POST",
        body: { bookId, quantity },
      }),
      invalidatesTags: ["Cart"], // ✅ should invalidate not provide
    }),

    // ❌ Remove from cart
    removeFromCart: builder.mutation({
      query: (bookId) => ({
        url: `/cart/remove?bookId=${bookId}`, // ✅ must be query param
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
} = cartApi;
