import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import type { RootState } from "../../app/store";

export interface INote {
  id: string;
  _id: string;
  user: string;
  username: string;
  title: string;
  text: string;
  completed: boolean;
  ticket?: number;
  createdAt: string;
  updatedAt: string;
}

interface NewNoteBody {
  user: string;
  title: string;
  text: string;
}

interface UpdateNoteBody {
  id: string;
  user: string;
  title: string;
  text: string;
  completed: boolean;
}

interface DeleteNoteBody {
  id: string;
}

const notesAdapter = createEntityAdapter<INote>();
const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query<EntityState<INote, string>, void>({
      query: () => "/notes",
      transformResponse: (responseData: INote[]) => {
        const loadedNotes = responseData.map((note) => ({
          ...note,
          id: note._id,
        }));
        return notesAdapter.setAll(initialState, loadedNotes);
      },
      providesTags: (result) =>
        result?.ids
          ? [
              { type: "Note" as const, id: "LIST" },
              ...result.ids.map((id) => ({ type: "Note" as const, id })),
            ]
          : [{ type: "Note" as const, id: "LIST" }],
    }),

    addNewNote: builder.mutation<{ message: string }, NewNoteBody>({
      query: (initialNote) => ({
        url: "/notes",
        method: "POST",
        body: { ...initialNote },
      }),
      invalidatesTags: [{ type: "Note", id: "LIST" }],
    }),

    updateNote: builder.mutation<string, UpdateNoteBody>({
      query: (initialNote) => ({
        url: "/notes",
        method: "PATCH",
        body: { ...initialNote },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Note", id: arg.id }],
    }),

    deleteNote: builder.mutation<string, DeleteNoteBody>({
      query: ({ id }) => ({
        url: "/notes",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Note", id: arg.id }],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;

export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data,
);

export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
} = notesAdapter.getSelectors<RootState>(
  (state) => selectNotesData(state) ?? initialState,
);
