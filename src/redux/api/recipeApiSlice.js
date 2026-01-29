import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const recipeApi = createApi({
  reducerPath: "recipe",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL, credentials: "include" }),
  endpoints: (builder) => ({
    createRecipe: builder.mutation({
      query: (recipeData) => ({
        url: "/recipe/add",
        method: "POST",
        body: recipeData,
        formData: true, // This tells RTK Query to not set Content-Type header
      }),
    }),
    allRecipe: builder.query({
      query: (params) => ({
        url: "/recipe/all",
        method: "GET",
        params, // Pass search parameters
        credentials: "include",
      }),
    }),
    recipeCount: builder.query({
      query: () => ({
        url: "/recipe/count",
        method: "GET",
        credentials: "include",
      }),
    }),
    updateRecipe: builder.mutation({
      query: ({ id, recipeData }) => ({
        url: `/recipe/update/${id}`,
        method: "PUT",
        body: recipeData,
        formData: true, // For file uploads
      }),
    }),
    deleteRecipe: builder.mutation({
      query: (id) => ({
        url: `/recipe/delete/${id}`,
        method: "DELETE",
      }),
    }),
    getSingleRecipe: builder.query({
      query: (id) => ({
        url: `/recipe/single/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateRecipeMutation,
  useAllRecipeQuery,
  useRecipeCountQuery,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useGetSingleRecipeQuery,
} = recipeApi;
