import { apiSlice } from "../../app/api/apiSlice";
import { logout, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
          dispatch(apiSlice.util.resetApiState());
        } catch (err) {
          console.log(err);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({ url: "/auth/refresh", method: "GET" }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken } = data;
          dispatch(setCredentials({ accessToken }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

// What it does
// This creates a logout action using RTK Query. When called, it tells the backend to log the user out, then cleans up the app's local state.

// Line by line
// sendLogout: builder.mutation({...})
// Creates a mutation (a request that changes data on the server) named sendLogout. You'll later call it from a component like const [sendLogout] = useSendLogoutMutation().

// query: () => ({ url: "/auth/logout", method: "POST" })
// Defines the actual HTTP request — sends a POST to /auth/logout on your backend. The backend will clear the refresh token cookie.

// async onQueryStarted(arg, { dispatch, queryFulfilled })
// A lifecycle hook that runs as soon as the request is fired. It lets you do extra work tied to that request — perfect for cleanup.

// arg → whatever you passed to sendLogout() (nothing here).
// dispatch → lets you trigger Redux actions.
// queryFulfilled → a promise that resolves when the server responds successfully.
// await queryFulfilled;
// Waits until the backend confirms logout was successful. If the server fails, this throws and jumps to catch.

// dispatch(logOut());
// Runs the logOut reducer from authSlice — this clears the access token from Redux state, so the user is no longer "logged in" on the frontend.

// dispatch(apiSlice.util.resetApiState());
// Wipes the entire RTK Query cache (users, notes, etc.). Important — otherwise the next user who logs in would see the previous user's cached data.

// catch (err) { console.log(err); }
// If logout fails (network down, server error), just logs it instead of crashing.

// TL;DR
// Tell the server to log out → wait for confirmation → clear the user from Redux → wipe all cached API data so nothing leaks between sessions.

export const { useLoginMutation, useRefreshMutation, useSendLogoutMutation } =
  authApiSlice;
