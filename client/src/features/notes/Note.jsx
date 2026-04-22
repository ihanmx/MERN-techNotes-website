import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { memo } from "react";

import { useGetNotesQuery } from "./notesApiSlice";

const Note = ({ noteId }) => {
  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[noteId],
    }),
  });

  const navigate = useNavigate();

  if (note) {
    const created = new Date(note.createdAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const updated = new Date(note.updatedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

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
        <td className="table__cell note__created">{created}</td>
        <td className="table__cell note__updated">{updated}</td>
        <td className="table__cell note__title">{note.title}</td>
        <td className="table__cell note__username">{note.username}</td>

        <td className="table__cell">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};
export default memo(Note);

// Simple guide: RTK Query vs Redux selectors
// The one-line rule
// Server data → RTK Query. Client-only state → Redux slice + selectors.

// What goes where
// Data	Where	Why
// Notes list from /notes	RTK Query (useGetNotesQuery)	It's on the server — needs fetching, caching, refetching
// Users list from /users	RTK Query (useGetUsersQuery)	Same
// Access token	Redux slice (authSlice) + useSelector	Client-only state, never fetched
// "Dark mode is on"	Redux slice + useSelector	Pure UI state
// Current logged-in user info	Redux selector (derived from token)	Computed from client state
// How to decide in 3 questions
// Does it come from a server endpoint? → RTK Query.
// Is it UI state that lives only in the browser? → Redux slice + selector.
// Is it derived from already-loaded data? → Either one, but prefer the same tool that owns the source data (RTK's selectFromResult if the source is server data; a regular selector if the source is slice state).
// Concrete examples from your app

// // ✅ Server data → RTK Query
// const { data: notes } = useGetNotesQuery();

// // ✅ Server data, one item from the list → RTK Query with selectFromResult
// const { note } = useGetNotesQuery("notesList", {
//   selectFromResult: ({ data }) => ({ note: data?.entities[id] }),
// });

// // ✅ Client state → useSelector
// const token = useSelector(selectCurrentToken);

// // ✅ Derived from client state → custom hook with useSelector + jwtDecode
// const { username, roles } = useAuth();
// Mental model
// RTK Query owns the server. Fetching, caching, invalidating tags, keeping data fresh.
// Redux slices own the browser. Auth tokens, UI toggles, form drafts, etc.
// Selectors are just how you read slice state cleanly.
// That's it. If something comes from an HTTP endpoint, RTK
