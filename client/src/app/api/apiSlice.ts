import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { setCredentials } from "../../features/auth/authSlice";
import type { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 403) {
    console.log("sending refresh token");
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult.data) {
      api.dispatch(
        setCredentials(refreshResult.data as { accessToken: string }),
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (
        refreshResult.error &&
        refreshResult.error.status === 403 &&
        typeof refreshResult.error.data === "object" &&
        refreshResult.error.data !== null
      ) {
        (refreshResult.error.data as { message: string }).message =
          "Your login has expired. ";
      }
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Note", "User"],
  endpoints: () => ({}),
});

// const baseQueryWithReauth: BaseQueryFn<
//   string | FetchArgs,        // args type   (URL string OR full FetchArgs object)
//   unknown,                   // result.data type (we don't know yet)
//   FetchBaseQueryError        // error type  (RTK's standard error shape)
// > = async (args, api, extraOptions) => { ... }
// args — "what should I fetch?"
// The instructions for this specific request. Either a simple URL string, or a full request object:

// '/notes'                                    // simple GET to /notes
// { url: '/notes', method: 'POST', body: ... }  // POST with body
// api — "the toolkit hooks for this request"
// A bundle of RTK utilities you can use mid-request. Its main fields:

// api.dispatch       // dispatch any Redux action (we use this for setCredentials)
// api.getState       // read current store state
// api.signal         // AbortController signal — cancel the request if needed
// api.endpoint       // name of the endpoint that triggered this query
// api.type           // 'query' or 'mutation'
// api.forced         // true if forceRefetch was used
// In the reauth wrapper, you used api.dispatch(setCredentials(...)) to update the auth slice when refresh succeeded. That's the whole point of api being there — it lets you reach back into Redux from inside the query layer.

// extraOptions — "per-call custom flags"
// A bag of arbitrary extra options you can pass when defining an endpoint:

// endpoints: (builder) => ({
//   getSecret: builder.query({
//     query: () => '/secret',
//     extraOptions: { shout: true },   // ← these arrive here
//   }),
// })
// Most of the time you don't use it. It's a hook for advanced cases (pass custom retry policies, feature flags, etc.).

// Now — the three generics of BaseQueryFn

// BaseQueryFn<Args, Result, Error>
// These describe three different things, and only one of them is a function parameter:

// Slot	Describes	Where in the code
// 1	The args parameter	the first input
// 2	The shape of result.data (success case)	the return value
// 3	The shape of result.error (error case)	the return value

// BaseQueryFn has three slots: input args, output data, output error. ()generic type
// The function has three parameters: args, api, extraOptions.

// They line up only on the first one. The other two function params are standardized by RTK and don't need generics. The other two generic slots describe the return value, not parameters.
