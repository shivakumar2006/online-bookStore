import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookApi = createApi({
    reducerPath: "bookApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080",
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