import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL, credentials: "include" }),
    endpoints: (builder) => ({
      register: builder.mutation({
        query: (userData) => ({
          url: "/auth/register",
          method: "POST",
          body: userData,
        }),
      }),
  }),
});

export const { useRegisterMutation } = authApi;
