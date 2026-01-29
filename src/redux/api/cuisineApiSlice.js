import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cuisineApi = createApi({
  reducerPath: "cuisine",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL, credentials: "include" }),
  endpoints: (builder) => ({
    createCuisine: builder.mutation({
      query: (cuisineData) => ({
        url: "/cuisine/",
        method: "POST",
        body: cuisineData,
      }),
    }),
    allCuisines: builder.query({
      query: (params) => ({
        url: "/cuisine/",
        method: "GET",
        params, 
        credentials: "include",
      }),
    }),
    cuisineCount: builder.query({
      query: () => ({
        url: "/cuisine/count",
        method: "GET",
        credentials: "include",
      }),
    }),
    getCuisine: builder.query({
      query: (id) => ({
        url: `/cuisine/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    updateCuisine: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/cuisine/${id}`,
        method: "PUT",
        body: patch,
      }),
    }),
    deleteCuisine: builder.mutation({
      query: (id) => ({
        url: `/cuisine/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateCuisineMutation,
  useAllCuisinesQuery,
  useCuisineCountQuery,
  useGetCuisineQuery,
  useUpdateCuisineMutation,
  useDeleteCuisineMutation,
} = cuisineApi;
