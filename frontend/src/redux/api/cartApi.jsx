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
 // ✅ only token (no "Bearer") — because Go expects raw JWT
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
        url: "/cart/remove",
        method: "DELETE",
        body: { book_id: bookId }, // ✅ Go backend expects this format
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
