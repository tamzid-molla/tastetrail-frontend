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
      }),
    }),
    allRecipe: builder.query({
      query: () => ({
        url: "/recipe/all",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useCreateRecipeMutation, useAllRecipeQuery } = recipeApi;
