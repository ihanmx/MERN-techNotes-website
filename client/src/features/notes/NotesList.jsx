import { useGetNotesQuery } from "./notesApiSlice";
import Note from "./Note";
import useAuth from "../../hooks/useAuth";

const NotesList = () => {
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery("notesList", {
    pollingInterval: 15000, //each 15 sec because notes more active
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { username, isManager, isAdmin } = useAuth();

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = notes;
    let filteredIds;

    if (isAdmin || isManager) {
      filteredIds = [...ids]; //Admins and manages should see all notes
    } else {
      filteredIds = ids.filter(
        (noteId) => entities[noteId].username === username,
      );
    }
    const tableContent = filteredIds.length
      ? filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />)
      : (
          <tr>
            <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
              No notes assigned to you.
            </td>
          </tr>
        );

    content = (
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
  }

  return content;
};
export default NotesList;
