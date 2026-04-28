import { useGetNotesQuery } from "./notesApiSlice";
import Note from "./Note";
import useAuth from "../../hooks/useAuth";
import { Alert, DataTable, PageHeader, Spinner, Badge } from "../../ui";

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

  if (isLoading)
    return (
      <div className="py-10 flex justify-center">
        <Spinner size={32} label="Loading notes..." />
      </div>
    );
  if (isError) return <Alert tone="danger">{getErrorMessage(error)}</Alert>;
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
      <td
        colSpan={6}
        className="px-4 py-10 text-center text-ink-400 italic"
      >
        No notes assigned to you.
      </td>
    </tr>
  );

  return (
    <section>
      <PageHeader
        title="techNotes"
        subtitle={
          isAdmin || isManager
            ? "All repair tickets across the team"
            : "Tickets assigned to you"
        }
        actions={
          <Badge tone="primary" dot>
            {filteredIds.length} total
          </Badge>
        }
      />

      <DataTable
        head={
          <tr>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3 hidden md:table-cell">
              Created
            </th>
            <th scope="col" className="px-4 py-3 hidden md:table-cell">
              Updated
            </th>
            <th scope="col" className="px-4 py-3">Title</th>
            <th scope="col" className="px-4 py-3 hidden md:table-cell">
              Owner
            </th>
            <th scope="col" className="px-4 py-3 text-right">Edit</th>
          </tr>
        }
      >
        {tableContent}
      </DataTable>
    </section>
  );
};

export default NotesList;