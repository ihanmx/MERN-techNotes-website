import { apiSlice } from "../../app/api/apiSlice";
import { logout, setCredentials } from "./authSlice";

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

interface RefreshResponse {
  accessToken: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    sendLogout: builder.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
          dispatch(apiSlice.util.resetApiState());
        } catch (err) {
          console.log(err);
        }
      },
    }),

    refresh: builder.mutation<RefreshResponse, void>({
      query: () => ({ url: "/auth/refresh", method: "GET" }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ accessToken: data.accessToken }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation, useSendLogoutMutation } =
  authApiSlice;

// builder.mutation<ResultType, ArgType>({...})
// //               ^^^^^^^^^^  ^^^^^^^
// //               slot 1      slot 2
// //               return      input
