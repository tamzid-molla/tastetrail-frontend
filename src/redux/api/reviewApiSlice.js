import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
  reducerPath: "review",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL, credentials: "include" }),
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: "/review/",
        method: "POST",
        body: reviewData,
      }),
    }),
    allReviews: builder.query({
      query: () => ({
        url: "/review/",
        method: "GET",
        credentials: "include",
      }),
    }),
    reviewCount: builder.query({
      query: () => ({
        url: "/review/count",
        method: "GET",
        credentials: "include",
      }),
    }),
    getReviewsByRecipe: builder.query({
      query: (recipeID) => ({
        url: `/review/${recipeID}/approved`,
        method: "GET",
        credentials: "include",
      }),
    }),
    approveReview: builder.mutation({
      query: (id) => ({
        url: `/review/${id}`,
        method: "PUT",
      }),
    }),
    rejectReview: builder.mutation({
      query: (id) => ({
        url: `/review/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useAllReviewsQuery,
  useReviewCountQuery,
  useGetReviewsByRecipeQuery,
  useApproveReviewMutation,
  useRejectReviewMutation,
} = reviewApi;
