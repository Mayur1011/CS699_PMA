const USER_URL = "/user";
import { apiSlice } from "../apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/profile`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/change-password`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    getTeamList: builder.query({
      query: () => ({
        url: `${USER_URL}/get-team`,
        method: "GET",
        credentials: "include",
      }),
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    userAction: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/${data.id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    getNotifications: builder.query({
      query: () => ({
        url: `${USER_URL}/notifications`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // markNotificationRead: builder.mutation({
    //   query: (data) => ({
    //     // url: `${USER_URL}/read-noti?isReadType=${data.type}&id=${data?.id}`,
    //     url: `${USER_URL}/read-noti?isReadType=${data.type}${
    //       data.id ? `&id=${data.id}` : ""
    //     }`,
    //     method: "PUT",
    //     body: data,
    //     credentials: "include",
    //   }),
    // }),

    // CHATGPT FIXED CODE
    markNotificationRead: builder.mutation({
      query: (data) => {
        const queryString =
          data.type === "all"
            ? `isReadType=all`
            : `isReadType=${data.type}&id=${data.id}`;
        return {
          url: `${USER_URL}/read-noti?${queryString}`,
          method: "PUT",
          body: data,
          credentials: "include",
        };
      },
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useChangePasswordMutation,
  useGetTeamListQuery,
  useDeleteUserMutation,
  useUserActionMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} = userApiSlice;
