import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import type { RootState } from "../../app/store";

export interface IUser {
  id: string;
  _id: string;
  username: string;
  roles: string[];
  active: boolean;
}

interface NewUserBody {
  username: string;
  password: string;
  roles: string[];
}

interface UpdateUserBody {
  id: string;
  username: string;
  password?: string;
  roles: string[];
  active: boolean;
}

interface DeleteUserBody {
  id: string;
}

// Once you provide <IUser>, the adapter knows your entity shape. Every method on it (setAll, addOne, removeOne, getSelectors) is now typed to accept and return IUsers
const usersAdapter = createEntityAdapter<IUser>();
const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //     interface EntityState<T, K> {
    //   ids: K[];                    // array of IDs (string in our case)
    //   entities: Record<K, T>;      // ID → user lookup map
    // }

    //IUser entity and id is string
    getUsers: builder.query<EntityState<IUser, string>, void>({
      query: () => "/users",
      transformResponse: (responseData: IUser[]) => {
        const loadedUsers = responseData.map((user) => ({
          ...user,
          id: user._id,
        }));
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      //as User to acespt my tag
      providesTags: (result) =>
        result?.ids
          ? [
              { type: "User" as const, id: "LIST" },
              ...result.ids.map((id) => ({ type: "User" as const, id })),
            ]
          : [{ type: "User" as const, id: "LIST" }],
    }),

    addNewUser: builder.mutation<{ message: string }, NewUserBody>({
      query: (initialUserData) => ({
        url: "/users",
        method: "POST",
        body: { ...initialUserData },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    updateUser: builder.mutation<{ message: string }, UpdateUserBody>({
      query: (initialUserData) => ({
        url: "/users",
        method: "PATCH",
        body: { ...initialUserData },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "User", id: arg.id }],
    }),

    deleteUser: builder.mutation<string, DeleteUserBody>({
      query: ({ id }) => ({
        url: "/users",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = usersApiSlice;

export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data,
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors<RootState>(
  (state) => selectUsersData(state) ?? initialState,
);

// selectAllUsers(rootState) → IUser[]
// selectUserById(rootState, '123') → IUser | undefined
// selectUserIds(rootState) → string[]
