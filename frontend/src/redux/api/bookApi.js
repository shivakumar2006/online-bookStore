import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookApi = createApi({
    reducerPath: "bookApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080",
        // baseUrl: "http://bookstore.local/api",
    }),
    endpoints: (builder) => ({
        getBooks: builder.query({
            query: () => "/books",
        }),
        getBookById: builder.query({
          query: (id) => `/books/${id}`,
        }),
    })
})

export const { useGetBooksQuery, useGetBookByIdQuery } = bookApi;