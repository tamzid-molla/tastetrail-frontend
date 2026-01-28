import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "category",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL, credentials: "include" }),
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: "/category/",
        method: "POST",
        body: categoryData,
      }),
    }),
    allCategories: builder.query({
      query: () => ({
        url: "/category/",
        method: "GET",
        credentials: "include",
      }),
    }),
    getCategory: builder.query({
      query: (id) => ({
        url: `/category/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/category/${id}`,
        method: "PUT",
        body: patch,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useAllCategoriesQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
