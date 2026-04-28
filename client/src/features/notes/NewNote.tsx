import { useGetUsersQuery } from "../users/usersApiSlice";
import type { IUser } from "../users/usersApiSlice";
import NewNoteForm from "./NewNoteForm";
import { Spinner } from "../../ui";

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

  if (!users.length)
    return (
      <div className="py-10 flex justify-center">
        <Spinner size={32} label="Loading users..." />
      </div>
    );

  return <NewNoteForm users={users} />;
};

export default NewNote;