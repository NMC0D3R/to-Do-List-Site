import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApiSlice = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/users" }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
      providesTags: ["User"],
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/forgotPassword",
        method: "POST",
        body: { email },
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logOut",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useForgotPasswordMutation,
  useLogoutUserMutation,
} = userApiSlice;
