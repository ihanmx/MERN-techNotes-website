import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGetNotesQuery } from "./notesApiSlice";

interface NoteProps {
  noteId: string;
}

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
  });

const Note = ({ noteId }: NoteProps) => {
  const { note } = useGetNotesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      note: data?.entities[noteId],
    }),
  });

  const navigate = useNavigate();

  if (!note) return null;

  const handleEdit = () => navigate(`/dash/notes/${noteId}`);

  return (
    <tr className="table__row">
      <td className="table__cell note__status">
        {note.completed ? (
          <span className="note__status--completed">Completed</span>
        ) : (
          <span className="note__status--open">Open</span>
        )}
      </td>
      <td className="table__cell note__created">
        {formatDate(note.createdAt)}
      </td>
      <td className="table__cell note__updated">
        {formatDate(note.updatedAt)}
      </td>
      <td className="table__cell note__title">{note.title}</td>
      <td className="table__cell note__username">{note.username}</td>
      <td className="table__cell">
        <button className="icon-button table__button" onClick={handleEdit}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      </td>
    </tr>
  );
};

export default memo(Note);
