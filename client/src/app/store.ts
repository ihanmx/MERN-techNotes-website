import { configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// RootState — derived automatically from your store's reducer shape using ReturnType<typeof store.getState>. Each time you add a slice, this type updates automatically. No hand-typing.
// AppDispatch — your dispatch function's exact type, including all middleware-injected dispatch types (like RTK Query thunks).

// Pattern	When to use
// typeof someValue	I want to reuse that value's type elsewhere (a function, an object, anything)
// ReturnType<typeof someFn>	I want to step inside a function and get just its return type
// In Redux:

// dispatch is used as a function → grab the whole function type → typeof
// state is what getState produces → grab the return → ReturnType<typeof ...>

// A normal Redux slice (authSlice) is just a reducer — it changes state in response to actions. That's all it does.

// RTK Query is way more than a reducer. It needs to:

// Track which queries are subscribed (cache lifetime).
// Auto-refetch when subscribers drop and re-mount.
// Run side effects when an endpoint succeeds (cache invalidation, optimistic updates).
// Throttle, deduplicate, and abort in-flight requests.
// Manage polling intervals.
// A reducer can't do any of that — reducers are pure, synchronous functions. So RTK Query ships a middleware that handles all this orchestration. Without it, queries dispatch their actions but nothing actually fetches data, nothing caches, nothing invalidates.
