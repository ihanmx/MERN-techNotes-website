import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGetNotesQuery } from "./notesApiSlice";
import { Badge, IconButton } from "../../ui";

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
    <tr className="hover:bg-white/5 transition-colors">
      <td className="px-4 py-3">
        {note.completed ? (
          <Badge tone="success" dot>
            Completed
          </Badge>
        ) : (
          <Badge tone="danger" dot>
            Open
          </Badge>
        )}
      </td>
      <td className="px-4 py-3 hidden md:table-cell text-ink-300 font-mono text-xs">
        {formatDate(note.createdAt)}
      </td>
      <td className="px-4 py-3 hidden md:table-cell text-ink-300 font-mono text-xs">
        {formatDate(note.updatedAt)}
      </td>
      <td className="px-4 py-3 font-semibold text-ink-100 max-w-md truncate">
        {note.title}
      </td>
      <td className="px-4 py-3 hidden md:table-cell text-ink-300">
        {note.username}
      </td>
      <td className="px-4 py-3 text-right">
        <IconButton tone="primary" label="Edit note" onClick={handleEdit}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </IconButton>
      </td>
    </tr>
  );
};

export default memo(Note);