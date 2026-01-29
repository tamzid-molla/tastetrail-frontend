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
  }),
});

export const {
  useUserCountQuery,
  useAllUsersQuery,
  useUpdateUserRoleMutation,
  useSuspendUserMutation,
  useActivateUserMutation,
} = userApi;
