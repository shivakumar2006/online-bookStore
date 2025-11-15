import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const wishlistApi = createApi({
    reducerPath: "wishlistApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8083",
        // baseUrl: "http://bookstore.local/api",
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const state = getState();
            const token = 
                state.auth?.token || 
                state.auth?.user?.access_token || 
                state.auth?.session?.access_token;

            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }

            headers.set("Content-Type", "application/json")
            return headers;
        }
    }),
    tagTypes: ["Wishlist"],

    endpoints: (builder) => ({
        getWishlist: builder.query({
          query: () => "/wishlist",
          providesTags: ["Wishlist"],
        }),

        addToWishlist: builder.mutation({
          query: (body) => ({
            url: "/wishlist/add",
            method: "POST",
            body,
          }),
          invalidatesTags: ["Wishlist"],
        }),

        removeFromWishlist: builder.mutation({
          query: ({bookId}) => ({
            url: "/wishlist/remove",
            method: "DELETE",
            body: JSON.stringify({bookId}),
          }),
          invalidatesTags: ["Wishlist"],
        }),
    })
});

export const { useGetWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation} = wishlistApi;