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
    }),
    getMyMealPlans: builder.query({
      query: () => ({
        url: "/mealPlan",
        method: "GET",
        credentials: "include",
      }),
    }),
    updateMealPlanStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/mealPlan/${id}`,
        method: "PUT",
        body: { status },
        credentials: "include",
      }),
    }),
    deleteMealPlan: builder.mutation({
      query: (id) => ({
        url: `/mealPlan/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useAddMealPlanMutation,
  useGetMyMealPlansQuery,
  useUpdateMealPlanStatusMutation,
  useDeleteMealPlanMutation,
} = mealPlanApi;
