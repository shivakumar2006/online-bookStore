import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8082/cart/:userId", // call microservice 
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.token; 
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            headers.set("Content-Type", "application/json")
            return headers; 
        }
    }),

    tagTypes: ["Cart"],

    endpoints: (builder) => ({
        getCart: builder.query({
            query: (userId) => `/${userId}`,
            providesTags: ["Cart"],
        }),

        addToCart: builder.mutation({
            query: ({ userId, bookId, quantity }) => ({
                url: `/${userId}/add`,
                method: "POST",
                body: { book_id: bookId, quantity },
            }),
            invalidatesTags: ["Cart"],
        }),

        updateCartItems: builder.mutation({
            query: ({ userId, bookId, quantity }) => ({
                url: `/${userId}/update`,
                method: "PUT",
                body: { book_id: bookId, quantity },
            }),
            invalidatesTags: ["Cart"],
        }),

        removeFromCart: builder.mutation({
            query: ({ userId, bookId }) => ({
                url: `/${userId}/remove/${bookId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        })
    })
})

export const { useGetCartQuery, useAddToCartMutation, useUpdateCartItemMutation, useRemoveFromCartMutation } = cartApi;