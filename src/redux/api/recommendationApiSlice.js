import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const recommendationApi = createApi({
  reducerPath: "recommendation",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL, credentials: "include" }),
  endpoints: (builder) => ({
    getPersonalizedRecommendations: builder.query({
      query: () => ({
        url: "/recommendations/personalized",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetPersonalizedRecommendationsQuery } = recommendationApi;
