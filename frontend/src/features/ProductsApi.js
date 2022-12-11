import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
    reducerPath: "productsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: () => "products",
        }),
        getProductDetails: builder.query({
            query: (id) => `products/${id}`
        }),
        createNewProduct: builder.query({
            query: () => '/products/create'
        })
    }),
});

export const { useGetAllProductsQuery, useGetProductDetailsQuery, createNewProduct } = productsApi;