import { PulseLoader } from "react-spinners";
import { useGetUsersQuery } from "../users/usersApiSlice";
import type { IUser } from "../users/usersApiSlice";
import NewNoteForm from "./NewNoteForm";

const NewNote = () => {
  const { users } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data }) => ({
      users: data
        ? data.ids
            .map((id) => data.entities[id])
            .filter((u): u is IUser => Boolean(u))
        : ([] as IUser[]),
    }),
  });

  if (!users.length) return <PulseLoader color="#FFF" />;

  return <NewNoteForm users={users} />;
};

export default NewNote;
