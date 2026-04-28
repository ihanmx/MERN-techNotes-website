import { useParams } from "react-router-dom";

import EditNoteForm from "./EditNoteForm";
import { useGetNotesQuery } from "./notesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import type { IUser } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import { Alert, Spinner } from "../../ui";

const EditNote = () => {
  const { id } = useParams<{ id: string }>();
  const { username, isManager, isAdmin } = useAuth();

  const { note } = useGetNotesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      note: id ? data?.entities[id] : undefined,
    }),
  });

  const { users } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data }) => ({
      users: data
        ? data.ids
            .map((uid) => data.entities[uid])
            .filter((u): u is IUser => Boolean(u))
        : ([] as IUser[]),
    }),
  });

  if (!note || !users.length)
    return (
      <div className="py-10 flex justify-center">
        <Spinner size={32} label="Loading..." />
      </div>
    );

  if (!isManager && !isAdmin && note.username !== username) {
    return <Alert tone="danger">No access</Alert>;
  }

  return <EditNoteForm note={note} users={users} />;
};

export default EditNote;