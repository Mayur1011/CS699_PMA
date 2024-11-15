const AUTH_URL = "/user";
import { apiSlice } from "../apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: data,
        credentials: "include",
        // use 'include' instead of true
      }),
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
