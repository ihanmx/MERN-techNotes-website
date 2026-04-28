import { useGetNotesQuery } from "./notesApiSlice";
import Note from "./Note";
import useAuth from "../../hooks/useAuth";

const getErrorMessage = (err: unknown): string => {
  if (
    typeof err === "object" &&
    err !== null &&
    "data" in err &&
    typeof err.data === "object" &&
    err.data !== null &&
    "message" in err.data
  ) {
    return String(err.data.message);
  }
  return "Failed to load notes";
};

const NotesList = () => {
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { username, isManager, isAdmin } = useAuth();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="errmsg">{getErrorMessage(error)}</p>;
  if (!isSuccess) return null;

  const { ids, entities } = notes;

  const filteredIds =
    isAdmin || isManager
      ? [...ids]
      : ids.filter((noteId) => entities[noteId]?.username === username);

  const tableContent = filteredIds.length ? (
    filteredIds.map((noteId) => <Note key={noteId} noteId={String(noteId)} />)
  ) : (
    <tr>
      <td colSpan={6} style={{ textAlign: "center", padding: "1rem" }}>
        No notes assigned to you.
      </td>
    </tr>
  );

  return (
    <table className="table table--notes">
      <thead className="table__thead">
        <tr>
          <th scope="col" className="table__th note__status">
            Status
          </th>
          <th scope="col" className="table__th note__created">
            Created
          </th>
          <th scope="col" className="table__th note__updated">
            Updated
          </th>
          <th scope="col" className="table__th note__title">
            Title
          </th>
          <th scope="col" className="table__th note__username">
            Owner
          </th>
          <th scope="col" className="table__th note__edit">
            Edit
          </th>
        </tr>
      </thead>
      <tbody>{tableContent}</tbody>
    </table>
  );
};

export default NotesList;
