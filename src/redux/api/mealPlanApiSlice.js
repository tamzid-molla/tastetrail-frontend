import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mealPlanApi = createApi({
  reducerPath: "mealPlan",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL, credentials: "include" }),
  endpoints: (builder) => ({
    addMealPlan: builder.mutation({
      query: (mealPlanData) => ({
        url: "/mealPlan",
        method: "POST",
        body: mealPlanData,
        credentials: "include",
      }),
      invalidatesTags: ["MealPlans"],
    }),
    getMyMealPlans: builder.query({
      query: () => ({
        url: "/mealPlan",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["MealPlans"],
    }),
    updateMealPlanStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/mealPlan/${id}`,
        method: "PUT",
        body: { status },
        credentials: "include",
      }),
      invalidatesTags: ["MealPlans", "CookingStats", "CookingAnalytics"],
    }),
    deleteMealPlan: builder.mutation({
      query: (id) => ({
        url: `/mealPlan/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["MealPlans"],
    }),
  }),
});

export const {
  useAddMealPlanMutation,
  useGetMyMealPlansQuery,
  useUpdateMealPlanStatusMutation,
  useDeleteMealPlanMutation,
} = mealPlanApi;
