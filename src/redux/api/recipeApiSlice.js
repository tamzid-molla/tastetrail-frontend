import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const recipeApi = createApi({
  reducerPath: "recipe",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL, credentials: "include" }),
  tagTypes: ["Recipes"],
  endpoints: (builder) => ({
    createRecipe: builder.mutation({
      query: (recipeData) => ({
        url: "/recipe/add",
        method: "POST",
        body: recipeData,
        formData: true, // This tells RTK Query to not set Content-Type header
      }),
      invalidatesTags: ["Recipes"],
    }),
    allRecipe: builder.query({
      query: (params) => ({
        url: "/recipe/all",
        method: "GET",
        params, 
        credentials: "include",
      }),
      providesTags: ["Recipes"],
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
      invalidatesTags: ["Recipes"],
    }),
    deleteRecipe: builder.mutation({
      query: (id) => ({
        url: `/recipe/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Recipes"],
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
