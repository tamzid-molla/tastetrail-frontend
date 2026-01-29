import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL, credentials: "include" }),
  endpoints: (builder) => ({
    userCount: builder.query({
      query: () => ({
        url: "/user/auth/count",
        method: "GET",
        credentials: "include",
      }),
    }),
    allUsers: builder.query({
      query: (params) => ({
        url: "/user/",
        method: "GET",
        params,
        credentials: "include",
      }),
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/user/${id}/role`,
        method: "PUT",
        body: { role },
      }),
    }),
    suspendUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}/suspend`,
        method: "PUT",
      }),
    }),
    activateUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}/activate`,
        method: "PUT",
      }),
    }),

    // Cookbook (saved recipes) - normal user
    getSavedRecipes: builder.query({
      query: () => ({
        url: "/user/saved",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["SavedRecipes"],
    }),
    toggleSavedRecipe: builder.mutation({
      query: (recipeId) => ({
        url: `/user/saved/${recipeId}`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["SavedRecipes"],
    }),
    getUserCookingStats: builder.query({
      query: () => ({
        url: "/user/cooking-stats",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["CookingStats"],
    }),
    getUserNutritionSummary: builder.query({
      query: () => ({
        url: "/user/nutrition-summary",
        method: "GET",
        credentials: "include",
      }),
    }),
    setUserYearlyGoal: builder.mutation({
      query: (goalData) => ({
        url: "/user/yearly-goal",
        method: "POST",
        body: goalData,
        credentials: "include",
      }),
      invalidatesTags: ["CookingAnalytics"],
    }),
    getUserCookingAnalytics: builder.query({
      query: (params) => ({
        url: "/user/cooking-analytics",
        method: "GET",
        params,
        credentials: "include",
      }),
      providesTags: ["CookingAnalytics"],
    }),
  }),
});

export const {
  useUserCountQuery,
  useAllUsersQuery,
  useUpdateUserRoleMutation,
  useSuspendUserMutation,
  useActivateUserMutation,
  useGetSavedRecipesQuery,
  useToggleSavedRecipeMutation,
  useGetUserCookingStatsQuery,
  useGetUserNutritionSummaryQuery,
  useSetUserYearlyGoalMutation,
  useGetUserCookingAnalyticsQuery,
} = userApi;
