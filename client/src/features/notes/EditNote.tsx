import { useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";

import EditNoteForm from "./EditNoteForm";
import { useGetNotesQuery } from "./notesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import type { IUser } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";

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

  if (!note || !users.length) return <PulseLoader color="#FFF" />;

  if (!isManager && !isAdmin && note.username !== username) {
    return <p className="errmsg">No access</p>;
  }

  return <EditNoteForm note={note} users={users} />;
};

export default EditNote;
